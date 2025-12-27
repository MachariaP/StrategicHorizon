from rest_framework import serializers
from .models import KPI


class KPISerializer(serializers.ModelSerializer):
    """Serializer for KPI model with validation rules."""
    progress_percentage = serializers.ReadOnlyField()
    actual_value = serializers.ReadOnlyField()  # Computed from current_value

    class Meta:
        model = KPI
        fields = [
            'id', 'goal', 'name', 'description', 
            'current_value', 'target_value', 'actual_value', 
            'unit', 'trend_data', 'progress_percentage', 
            'is_deleted', 'deleted_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'progress_percentage', 'actual_value', 'created_at', 'updated_at', 'is_deleted', 'deleted_at']

    def validate(self, data):
        """
        Ensure target_value is greater than 0 and makes sense with current_value.
        """
        target_value = data.get('target_value')
        current_value = data.get('current_value')
        
        # For updates, use existing values if not provided
        if self.instance:
            target_value = target_value if target_value is not None else self.instance.target_value
            current_value = current_value if current_value is not None else self.instance.current_value
        
        if target_value is not None and target_value <= 0:
            raise serializers.ValidationError({
                'target_value': 'Target value must be greater than 0.'
            })
        
        # Optional: Warn if current_value exceeds target_value (but don't block)
        if current_value and target_value and current_value > target_value:
            # This is allowed (over-achievement), just log or handle UI-side
            pass
        
        return data
    
    def validate_goal(self, value):
        """Ensure the goal belongs to the current user."""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            if value.user != request.user:
                raise serializers.ValidationError(
                    "You can only create KPIs for your own goals."
                )
        return value

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
