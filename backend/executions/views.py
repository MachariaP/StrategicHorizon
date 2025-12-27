from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from core.permissions import IsOwner
from .models import Execution
from .serializers import ExecutionSerializer
from typing import Any


class ExecutionThrottle(UserRateThrottle):
    """Custom throttle for Execution endpoints"""
    rate = '200/hour'


class ExecutionViewSet(viewsets.ModelViewSet):
    serializer_class = ExecutionSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    throttle_classes = [ExecutionThrottle]

    def get_queryset(self) -> Any:
        """Return only non-deleted executions for the current user with optimized queries"""
        return Execution.objects.filter(
            user=self.request.user,
            is_deleted=False
        ).select_related('goal', 'goal__vision')
