from django.contrib import admin
from .models import KPI, KPIHistory


@admin.register(KPI)
class KPIAdmin(admin.ModelAdmin):
    list_display = ['name', 'goal', 'current_value', 'target_value', 'unit', 'progress_percentage', 'created_at']
    list_filter = ['is_deleted', 'created_at', 'goal']
    search_fields = ['name', 'description', 'goal__title']
    readonly_fields = ['progress_percentage', 'actual_value', 'created_at', 'updated_at']


@admin.register(KPIHistory)
class KPIHistoryAdmin(admin.ModelAdmin):
    list_display = ['kpi', 'value', 'recorded_at']
    list_filter = ['recorded_at', 'kpi']
    search_fields = ['kpi__name']
    readonly_fields = ['recorded_at']
    date_hierarchy = 'recorded_at'

