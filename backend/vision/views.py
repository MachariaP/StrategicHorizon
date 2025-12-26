from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Vision
from .serializers import VisionSerializer


class VisionViewSet(viewsets.ModelViewSet):
    serializer_class = VisionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Vision.objects.filter(user=self.request.user)
