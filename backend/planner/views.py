from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    Vision, Goal, KPI, NonNegotiable, System, Person,
    Execution, Obstacle, QuarterlyReflection
)
from .serializers import (
    VisionSerializer, GoalSerializer, KPISerializer,
    NonNegotiableSerializer, SystemSerializer, PersonSerializer,
    ExecutionSerializer, ObstacleSerializer, QuarterlyReflectionSerializer
)


class VisionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Vision model.
    Provides CRUD operations for yearly vision and theme.
    """
    serializer_class = VisionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return visions for the authenticated user only"""
        return Vision.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Set the user to the authenticated user"""
        serializer.save(user=self.request.user)


class GoalViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Goal model.
    Provides CRUD operations for goals with status tracking.
    """
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return goals for the authenticated user only"""
        return Goal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Set the user to the authenticated user"""
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def by_status(self, request):
        """Filter goals by status"""
        status = request.query_params.get('status', None)
        queryset = self.get_queryset()
        if status:
            queryset = queryset.filter(status=status)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class KPIViewSet(viewsets.ModelViewSet):
    """
    ViewSet for KPI model.
    Provides CRUD operations for Key Performance Indicators.
    """
    serializer_class = KPISerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return KPIs for the authenticated user only"""
        return KPI.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Set the user to the authenticated user"""
        serializer.save(user=self.request.user)


class NonNegotiableViewSet(viewsets.ModelViewSet):
    """
    ViewSet for NonNegotiable model.
    Provides CRUD operations for daily/weekly boundaries.
    """
    serializer_class = NonNegotiableSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return non-negotiables for the authenticated user only"""
        return NonNegotiable.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Set the user to the authenticated user"""
        serializer.save(user=self.request.user)


class SystemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for System model.
    Provides CRUD operations for recurring processes/habits.
    """
    serializer_class = SystemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return systems for the authenticated user only"""
        return System.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Set the user to the authenticated user"""
        serializer.save(user=self.request.user)


class PersonViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Person model.
    Provides CRUD operations for mentors, partners, supporters.
    """
    serializer_class = PersonSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return people for the authenticated user only"""
        return Person.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Set the user to the authenticated user"""
        serializer.save(user=self.request.user)


class ExecutionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Execution model.
    Provides CRUD operations for monthly roadmap tasks.
    """
    serializer_class = ExecutionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return executions for the authenticated user only"""
        return Execution.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Set the user to the authenticated user"""
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def by_month(self, request):
        """Filter executions by month and year"""
        month = request.query_params.get('month', None)
        year = request.query_params.get('year', None)
        queryset = self.get_queryset()
        if month:
            queryset = queryset.filter(month=month)
        if year:
            queryset = queryset.filter(year=year)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ObstacleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Obstacle model.
    Provides CRUD operations for risks and mitigations.
    """
    serializer_class = ObstacleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return obstacles for the authenticated user only"""
        return Obstacle.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Set the user to the authenticated user"""
        serializer.save(user=self.request.user)


class QuarterlyReflectionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for QuarterlyReflection model.
    Provides CRUD operations for quarterly reviews.
    """
    serializer_class = QuarterlyReflectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return reflections for the authenticated user only"""
        return QuarterlyReflection.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Set the user to the authenticated user"""
        serializer.save(user=self.request.user)

