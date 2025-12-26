from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuarterlyReflectionViewSet

router = DefaultRouter()
router.register(r'', QuarterlyReflectionViewSet, basename='reflection')

urlpatterns = [
    path('', include(router.urls)),
]
