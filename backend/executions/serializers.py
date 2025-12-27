from rest_framework import serializers
from .models import Execution
from typing import Dict, Any


class ExecutionSerializer(serializers.ModelSerializer):
    """Serializer for Execution model with goal relationship details."""
    goal_title = serializers.CharField(source='goal.title', read_only=True, allow_null=True)
    goal_status = serializers.CharField(source='goal.status', read_only=True, allow_null=True)
    month_display = serializers.CharField(source='get_month_display', read_only=True)
    
    class Meta:
        model = Execution
        fields = [
            'id', 'goal', 'goal_title', 'goal_status', 'title', 'description', 
            'month', 'month_display', 'year', 'status',
            'is_deleted', 'deleted_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'goal_title', 'goal_status', 'month_display',
            'created_at', 'updated_at', 'is_deleted', 'deleted_at'
        ]

    def create(self, validated_data: Dict[str, Any]) -> Execution:
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
