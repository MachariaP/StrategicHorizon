from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VisionViewSet

router = DefaultRouter()
router.register(r'', VisionViewSet, basename='vision')

urlpatterns = [
    path('', include(router.urls)),
]
