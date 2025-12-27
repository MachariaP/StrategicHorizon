from rest_framework import serializers
from .models import System
from typing import Dict, Any


class SystemSerializer(serializers.ModelSerializer):
    """Serializer for System model with health tracking."""
    frequency_display = serializers.CharField(source='get_frequency_display', read_only=True)
    health_status_display = serializers.CharField(source='get_health_status_display', read_only=True)
    
    class Meta:
        model = System
        fields = [
            'id', 'name', 'description', 'frequency', 'frequency_display',
            'input_definition', 'output_kpi_link',
            'last_execution_date', 'health_status', 'health_status_display',
            'is_deleted', 'deleted_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'health_status', 'frequency_display', 'health_status_display',
            'created_at', 'updated_at', 'is_deleted', 'deleted_at'
        ]

    def create(self, validated_data: Dict[str, Any]) -> System:
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
