from django.contrib import admin
from .models import (
    Vision, Goal, KPI, NonNegotiable, System, Person,
    Execution, Obstacle, QuarterlyReflection
)


@admin.register(Vision)
class VisionAdmin(admin.ModelAdmin):
    list_display = ['user', 'year', 'yearly_theme', 'created_at']
    list_filter = ['year', 'created_at']
    search_fields = ['user__username', 'yearly_theme', 'north_star']


@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'status', 'target_date', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__username', 'title', 'description']


@admin.register(KPI)
class KPIAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'goal', 'target_value', 'actual_value', 'unit']
    list_filter = ['created_at']
    search_fields = ['user__username', 'name', 'goal__title']


@admin.register(NonNegotiable)
class NonNegotiableAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'frequency', 'created_at']
    list_filter = ['frequency', 'created_at']
    search_fields = ['user__username', 'title']


@admin.register(System)
class SystemAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'frequency', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'name']


@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'role', 'created_at']
    list_filter = ['role', 'created_at']
    search_fields = ['user__username', 'name', 'role_description']


@admin.register(Execution)
class ExecutionAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'month', 'year', 'status', 'created_at']
    list_filter = ['month', 'year', 'status', 'created_at']
    search_fields = ['user__username', 'title', 'description']


@admin.register(Obstacle)
class ObstacleAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'severity', 'goal', 'created_at']
    list_filter = ['severity', 'created_at']
    search_fields = ['user__username', 'title', 'description']


@admin.register(QuarterlyReflection)
class QuarterlyReflectionAdmin(admin.ModelAdmin):
    list_display = ['user', 'quarter', 'year', 'created_at']
    list_filter = ['quarter', 'year', 'created_at']
    search_fields = ['user__username', 'wins', 'challenges']

