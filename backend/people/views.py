from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from core.permissions import IsOwner
from .models import Person
from .serializers import PersonSerializer
from typing import Any


class PersonThrottle(UserRateThrottle):
    """Custom throttle for Person endpoints"""
    rate = '200/hour'


class PersonViewSet(viewsets.ModelViewSet):
    serializer_class = PersonSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    throttle_classes = [PersonThrottle]

    def get_queryset(self) -> Any:
        """Return only non-deleted people for the current user"""
        return Person.objects.filter(
            user=self.request.user,
            is_deleted=False
        )
