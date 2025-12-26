from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NonNegotiableViewSet

router = DefaultRouter()
router.register(r'', NonNegotiableViewSet, basename='nonnegotiable')

urlpatterns = [
    path('', include(router.urls)),
]
