from rest_framework import serializers
from .models import KPI, KPIHistory
from typing import Dict, Any


class KPIHistorySerializer(serializers.ModelSerializer):
    """Serializer for KPIHistory model."""
    
    class Meta:
        model = KPIHistory
        fields = ['id', 'kpi', 'value', 'recorded_at']
        read_only_fields = ['id', 'recorded_at']


class KPISerializer(serializers.ModelSerializer):
    """Serializer for KPI model with validation rules."""
    progress_percentage = serializers.ReadOnlyField()
    actual_value = serializers.ReadOnlyField()  # Computed from current_value
    goal_title = serializers.CharField(source='goal.title', read_only=True)
    goal_status = serializers.CharField(source='goal.status', read_only=True)
    history_trend_data = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = KPI
        fields = [
            'id', 'goal', 'goal_title', 'goal_status', 'name', 'description', 
            'current_value', 'target_value', 'actual_value', 
            'unit', 'trend_data', 'history_trend_data', 'progress_percentage', 
            'is_deleted', 'deleted_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'progress_percentage', 'actual_value', 'goal_title', 
            'goal_status', 'history_trend_data', 'created_at', 'updated_at', 'is_deleted', 'deleted_at'
        ]
    
    def get_history_trend_data(self, obj: KPI) -> list:
        """Get trend data from KPIHistory model."""
        return obj.get_history_trend_data()

    def validate(self, data: Dict[str, Any]) -> Dict[str, Any]:
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
    
    def validate_goal(self, value: Any) -> Any:
        """Ensure the goal belongs to the current user."""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            if value.user != request.user:
                raise serializers.ValidationError(
                    "You can only create KPIs for your own goals."
                )
        return value

    def create(self, validated_data: Dict[str, Any]) -> KPI:
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
