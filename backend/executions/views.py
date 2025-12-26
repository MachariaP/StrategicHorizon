from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Execution
from .serializers import ExecutionSerializer


class ExecutionViewSet(viewsets.ModelViewSet):
    serializer_class = ExecutionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Execution.objects.filter(user=self.request.user)
