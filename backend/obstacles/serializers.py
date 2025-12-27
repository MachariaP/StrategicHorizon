from rest_framework import serializers
from .models import Obstacle
from typing import Dict, Any


class ObstacleSerializer(serializers.ModelSerializer):
    """Serializer for Obstacle model with severity tracking."""
    mitigation = serializers.ReadOnlyField()  # Alias for mitigation_plan
    goal_title = serializers.CharField(source='goal.title', read_only=True, allow_null=True)
    goal_status = serializers.CharField(source='goal.status', read_only=True, allow_null=True)
    
    class Meta:
        model = Obstacle
        fields = [
            'id', 'goal', 'goal_title', 'goal_status', 'title', 'description', 
            'severity', 'severity_index', 
            'mitigation_plan', 'mitigation',  # Include both
            'is_blocking',
            'is_deleted', 'deleted_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'mitigation', 'goal_title', 'goal_status',
            'created_at', 'updated_at', 'is_deleted', 'deleted_at'
        ]
    
    def validate_severity_index(self, value: int) -> int:
        """Validate severity index is between 1 and 10."""
        if value < 1 or value > 10:
            raise serializers.ValidationError(
                "Severity index must be between 1 (minimal) and 10 (catastrophic)."
            )
        return value

    def create(self, validated_data: Dict[str, Any]) -> Obstacle:
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
