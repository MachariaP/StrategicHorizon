from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Person
from .serializers import PersonSerializer


class PersonViewSet(viewsets.ModelViewSet):
    serializer_class = PersonSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Person.objects.filter(user=self.request.user)
