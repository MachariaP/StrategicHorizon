from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from core.permissions import IsOwner
from .models import QuarterlyReflection
from .serializers import QuarterlyReflectionSerializer
from typing import Any


class ReflectionThrottle(UserRateThrottle):
    """Custom throttle for QuarterlyReflection endpoints"""
    rate = '200/hour'


class QuarterlyReflectionViewSet(viewsets.ModelViewSet):
    serializer_class = QuarterlyReflectionSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    throttle_classes = [ReflectionThrottle]

    def get_queryset(self) -> Any:
        """Return only non-deleted reflections for the current user"""
        return QuarterlyReflection.objects.filter(
            user=self.request.user,
            is_deleted=False
        )
