from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import QuarterlyReflection
from .serializers import QuarterlyReflectionSerializer


class QuarterlyReflectionViewSet(viewsets.ModelViewSet):
    serializer_class = QuarterlyReflectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return QuarterlyReflection.objects.filter(user=self.request.user)
