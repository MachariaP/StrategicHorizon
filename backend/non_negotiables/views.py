from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from core.permissions import IsOwner
from .models import NonNegotiable
from .serializers import NonNegotiableSerializer
from typing import Any


class NonNegotiableThrottle(UserRateThrottle):
    """Custom throttle for NonNegotiable endpoints"""
    rate = '200/hour'


class NonNegotiableViewSet(viewsets.ModelViewSet):
    serializer_class = NonNegotiableSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    throttle_classes = [NonNegotiableThrottle]

    def get_queryset(self) -> Any:
        """Return only non-deleted non-negotiables for the current user"""
        return NonNegotiable.objects.filter(
            user=self.request.user,
            is_deleted=False
        )
