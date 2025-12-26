from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ObstacleViewSet

router = DefaultRouter()
router.register(r'', ObstacleViewSet, basename='obstacle')

urlpatterns = [
    path('', include(router.urls)),
]
