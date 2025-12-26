from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import KPI
from .serializers import KPISerializer


class KPIViewSet(viewsets.ModelViewSet):
    serializer_class = KPISerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return KPI.objects.filter(user=self.request.user)
