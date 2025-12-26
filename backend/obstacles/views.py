from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Obstacle
from .serializers import ObstacleSerializer


class ObstacleViewSet(viewsets.ModelViewSet):
    serializer_class = ObstacleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Obstacle.objects.filter(user=self.request.user)
