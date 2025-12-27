from rest_framework import serializers
from .models import Obstacle


class ObstacleSerializer(serializers.ModelSerializer):
    """Serializer for Obstacle model with severity tracking."""
    mitigation = serializers.ReadOnlyField()  # Alias for mitigation_plan
    
    class Meta:
        model = Obstacle
        fields = [
            'id', 'goal', 'title', 'description', 
            'severity', 'severity_index', 
            'mitigation_plan', 'mitigation',  # Include both
            'is_blocking',
            'is_deleted', 'deleted_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'mitigation', 'created_at', 'updated_at', 'is_deleted', 'deleted_at']
    
    def validate_severity_index(self, value):
        """Validate severity index is between 1 and 10."""
        if value < 1 or value > 10:
            raise serializers.ValidationError(
                "Severity index must be between 1 (minimal) and 10 (catastrophic)."
            )
        return value

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
