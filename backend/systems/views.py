from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from core.permissions import IsOwner
from .models import System
from .serializers import SystemSerializer
from typing import Any


class SystemThrottle(UserRateThrottle):
    """Custom throttle for System endpoints"""
    rate = '200/hour'


class SystemViewSet(viewsets.ModelViewSet):
    serializer_class = SystemSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    throttle_classes = [SystemThrottle]

    def get_queryset(self) -> Any:
        """Return only non-deleted systems for the current user"""
        return System.objects.filter(
            user=self.request.user,
            is_deleted=False
        )
