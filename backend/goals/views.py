from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from rest_framework.response import Response
from django.db.models import Prefetch, Count, Avg, Q
from core.permissions import IsOwner
from .models import Goal
from .serializers import GoalSerializer, GoalListSerializer
from typing import Any


class GoalThrottle(UserRateThrottle):
    """Custom throttle for Goal endpoints"""
    rate = '200/hour'


class GoalViewSet(viewsets.ModelViewSet):
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    throttle_classes = [GoalThrottle]

    def get_queryset(self) -> Any:
        """Return only non-deleted goals for the current user with highly optimized queries"""
        user = self.request.user
        
        # Annotate with counts to avoid N+1 queries
        return Goal.objects.filter(
            user=user,
            is_deleted=False
        ).select_related(
            'vision',  # Single JOIN for vision data
            'parent_goal'  # Single JOIN for parent data
        ).prefetch_related(
            Prefetch('kpis', queryset=Goal.objects.none()),  # Will be loaded separately if needed
            Prefetch('sub_goals', queryset=Goal.objects.filter(is_deleted=False))
        ).annotate(
            kpi_count=Count('kpis', filter=Q(kpis__is_deleted=False)),
            sub_goal_count=Count('sub_goals', filter=Q(sub_goals__is_deleted=False))
        ).order_by('strategic_level', '-created_at')
    
    def get_serializer_class(self) -> Any:
        """Use lightweight serializer for list action"""
        if self.action == 'list':
            return GoalListSerializer
        return GoalSerializer
    
    @action(detail=True, methods=['get'])
    def sub_goals(self, request, pk=None):
        """Get all sub-goals for a parent goal"""
        goal = self.get_object()
        sub_goals = goal.sub_goals.filter(is_deleted=False)
        serializer = GoalListSerializer(sub_goals, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def strategic_goals(self, request):
        """Get only high-level strategic goals"""
        goals = self.get_queryset().filter(strategic_level='high')
        page = self.paginate_queryset(goals)
        if page is not None:
            serializer = GoalListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = GoalListSerializer(goals, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def tactical_goals(self, request):
        """Get only low-level tactical goals"""
        goals = self.get_queryset().filter(strategic_level='low')
        page = self.paginate_queryset(goals)
        if page is not None:
            serializer = GoalListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = GoalListSerializer(goals, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def confidence_matrix(self, request):
        """Get goals grouped by confidence vs progress matrix"""
        goals = self.get_queryset()
        
        # Calculate progress for each goal (if not already annotated)
        for goal in goals:
            if not hasattr(goal, 'progress_percentage_calculated'):
                goal.progress_percentage = goal.get_progress_percentage()
        
        # Quadrant 1: High Progress, High Confidence
        quadrant1 = [g for g in goals if g.progress_percentage >= 70 and g.confidence_level >= 4]
        
        # Quadrant 2: High Progress, Low Confidence
        quadrant2 = [g for g in goals if g.progress_percentage >= 70 and g.confidence_level <= 2]
        
        # Quadrant 3: Low Progress, High Confidence
        quadrant3 = [g for g in goals if g.progress_percentage <= 30 and g.confidence_level >= 4]
        
        # Quadrant 4: Low Progress, Low Confidence
        quadrant4 = [g for g in goals if g.progress_percentage <= 30 and g.confidence_level <= 2]
        
        data = {
            'quadrant1': GoalListSerializer(quadrant1, many=True).data,
            'quadrant2': GoalListSerializer(quadrant2, many=True).data,
            'quadrant3': GoalListSerializer(quadrant3, many=True).data,
            'quadrant4': GoalListSerializer(quadrant4, many=True).data,
            'stats': {
                'total': goals.count(),
                'high_risk': len(quadrant4),
                'false_security': len(quadrant2),
                'on_track': len(quadrant1),
                'early_stage': len(quadrant3),
            }
        }
        
        return Response(data)