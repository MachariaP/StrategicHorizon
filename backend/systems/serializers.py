from rest_framework import serializers
from .models import System


class SystemSerializer(serializers.ModelSerializer):
    """Serializer for System model with health tracking."""
    
    class Meta:
        model = System
        fields = [
            'id', 'name', 'description', 'frequency', 
            'input_definition', 'output_kpi_link',
            'last_execution_date', 'health_status',
            'is_deleted', 'deleted_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'health_status', 'created_at', 'updated_at', 'is_deleted', 'deleted_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
