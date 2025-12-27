from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from core.permissions import IsOwner
from .models import Obstacle
from .serializers import ObstacleSerializer
from typing import Any


class ObstacleThrottle(UserRateThrottle):
    """Custom throttle for Obstacle endpoints"""
    rate = '200/hour'


class ObstacleViewSet(viewsets.ModelViewSet):
    serializer_class = ObstacleSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    throttle_classes = [ObstacleThrottle]

    def get_queryset(self) -> Any:
        """Return only non-deleted obstacles for the current user with optimized queries"""
        return Obstacle.objects.filter(
            user=self.request.user,
            is_deleted=False
        ).select_related('goal', 'goal__vision')
