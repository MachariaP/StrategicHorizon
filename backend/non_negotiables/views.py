from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import NonNegotiable
from .serializers import NonNegotiableSerializer


class NonNegotiableViewSet(viewsets.ModelViewSet):
    serializer_class = NonNegotiableSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return NonNegotiable.objects.filter(user=self.request.user)
