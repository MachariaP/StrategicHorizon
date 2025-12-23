from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    VisionViewSet, GoalViewSet, KPIViewSet,
    NonNegotiableViewSet, SystemViewSet, PersonViewSet,
    ExecutionViewSet, ObstacleViewSet, QuarterlyReflectionViewSet
)

router = DefaultRouter()
router.register(r'visions', VisionViewSet, basename='vision')
router.register(r'goals', GoalViewSet, basename='goal')
router.register(r'kpis', KPIViewSet, basename='kpi')
router.register(r'non-negotiables', NonNegotiableViewSet, basename='non-negotiable')
router.register(r'systems', SystemViewSet, basename='system')
router.register(r'people', PersonViewSet, basename='person')
router.register(r'executions', ExecutionViewSet, basename='execution')
router.register(r'obstacles', ObstacleViewSet, basename='obstacle')
router.register(r'reflections', QuarterlyReflectionViewSet, basename='reflection')

urlpatterns = [
    path('', include(router.urls)),
]
