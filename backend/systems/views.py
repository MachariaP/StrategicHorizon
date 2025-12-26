from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import System
from .serializers import SystemSerializer


class SystemViewSet(viewsets.ModelViewSet):
    serializer_class = SystemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return System.objects.filter(user=self.request.user)
