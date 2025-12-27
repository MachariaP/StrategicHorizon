from rest_framework import serializers
from .models import Goal


class GoalSerializer(serializers.ModelSerializer):
    """Serializer for Goal model with validation rules."""
    progress_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = Goal
        fields = [
            'id', 'vision', 'title', 'description', 'status', 
            'confidence_level', 'target_date', 'is_deleted', 'deleted_at',
            'progress_percentage', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'progress_percentage', 'created_at', 'updated_at', 'is_deleted', 'deleted_at']

    def validate_vision(self, value):
        """Ensure a Goal is linked to a Vision before saving."""
        if value is None:
            raise serializers.ValidationError(
                "A Goal cannot be saved without being linked to a Vision."
            )
        
        # Ensure the vision belongs to the current user
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            if value.user != request.user:
                raise serializers.ValidationError(
                    "You can only link goals to your own visions."
                )
        
        return value
    
    def validate_confidence_level(self, value):
        """Validate confidence level is between 1 and 5."""
        if value < 1 or value > 5:
            raise serializers.ValidationError(
                "Confidence level must be between 1 (low) and 5 (high)."
            )
        return value

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
