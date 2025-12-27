from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
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
        """Return only non-deleted goals for the current user with optimized queries"""
        return Goal.objects.filter(
            user=self.request.user
        ).select_related(
            'vision', 'vision__user'
        ).prefetch_related(
            'kpis', 'obstacles', 'executions'
        )
    
    def get_serializer_class(self) -> Any:
        """Use lightweight serializer for list action"""
        if self.action == 'list':
            return GoalListSerializer
        return GoalSerializer
