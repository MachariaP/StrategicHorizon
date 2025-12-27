from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from core.permissions import IsOwner
from .models import KPI
from .serializers import KPISerializer
from typing import Any


class KPIThrottle(UserRateThrottle):
    """Custom throttle for KPI endpoints"""
    rate = '200/hour'


class KPIViewSet(viewsets.ModelViewSet):
    serializer_class = KPISerializer
    permission_classes = [IsAuthenticated, IsOwner]
    throttle_classes = [KPIThrottle]

    def get_queryset(self) -> Any:
        """Return only non-deleted KPIs for the current user with optimized queries"""
        return KPI.objects.filter(
            user=self.request.user,
            is_deleted=False
        ).select_related('goal', 'goal__vision')
