from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from core.permissions import IsOwner
from .models import Vision
from .serializers import VisionSerializer, VisionArchiveSerializer
from typing import Any


class VisionThrottle(UserRateThrottle):
    """Custom throttle for Vision endpoints"""
    rate = '100/hour'


class VisionViewSet(viewsets.ModelViewSet):
    serializer_class = VisionSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    throttle_classes = [VisionThrottle]

    def get_queryset(self) -> Any:
        """Return only non-deleted visions for the current user"""
        return Vision.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['patch'], url_path='soft-delete')
    def soft_delete(self, request: Any, pk: Any = None) -> Response:
        """Soft delete a vision (archive it)"""
        vision = self.get_object()
        vision.soft_delete()
        return Response({
            'message': 'Vision archived successfully. It\'s okay to pivot.',
            'id': str(vision.id)
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['patch'], url_path='restore')
    def restore(self, request: Any, pk: Any = None) -> Response:
        """Restore a soft deleted vision"""
        try:
            # Access all objects including deleted ones
            vision = Vision.all_objects.get(pk=pk, user=request.user)
            if not vision.is_deleted:
                return Response({
                    'message': 'Vision is not archived.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            vision.restore()
            serializer = self.get_serializer(vision)
            return Response({
                'message': 'Vision restored successfully.',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except Vision.DoesNotExist:
            return Response({
                'message': 'Vision not found.'
            }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'], url_path='archived')
    def archived(self, request: Any) -> Response:
        """Get all archived visions for the current user"""
        archived_visions = Vision.objects.archived().filter(user=request.user)
        serializer = VisionArchiveSerializer(archived_visions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
