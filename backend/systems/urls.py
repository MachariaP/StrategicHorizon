from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SystemViewSet

router = DefaultRouter()
router.register(r'', SystemViewSet, basename='system')

urlpatterns = [
    path('', include(router.urls)),
]
