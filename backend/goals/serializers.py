from rest_framework import serializers
from .models import Goal
from vision.serializers import VisionSerializer
from typing import Dict, Any


class GoalSerializer(serializers.ModelSerializer):
    """Serializer for Goal model with validation rules and relationship depth."""
    progress_percentage = serializers.ReadOnlyField()
    kpi_count = serializers.SerializerMethodField(read_only=True)
    vision_details = VisionSerializer(source='vision', read_only=True)
    
    class Meta:
        model = Goal
        fields = [
            'id', 'vision', 'vision_details', 'title', 'description', 'status', 
            'confidence_level', 'target_date', 'is_deleted', 'deleted_at',
            'progress_percentage', 'kpi_count', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'progress_percentage', 'kpi_count', 'vision_details',
            'created_at', 'updated_at', 'is_deleted', 'deleted_at'
        ]
    
    def get_kpi_count(self, obj: Goal) -> int:
        """
        Get the count of active KPIs linked to this goal.
        
        Args:
            obj: Goal instance
            
        Returns:
            Number of active KPIs
        """
        return obj.get_kpi_count()

    def validate_vision(self, value: Any) -> Any:
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
    
    def validate_confidence_level(self, value: int) -> int:
        """Validate confidence level is between 1 and 5."""
        if value < 1 or value > 5:
            raise serializers.ValidationError(
                "Confidence level must be between 1 (low) and 5 (high)."
            )
        return value

    def create(self, validated_data: Dict[str, Any]) -> Goal:
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class GoalListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing goals without full vision details."""
    progress_percentage = serializers.ReadOnlyField()
    kpi_count = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Goal
        fields = [
            'id', 'vision', 'title', 'description', 'status', 
            'confidence_level', 'target_date', 'progress_percentage', 
            'kpi_count', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'progress_percentage', 'kpi_count', 
            'created_at', 'updated_at'
        ]
    
    def get_kpi_count(self, obj: Goal) -> int:
        """
        Get the count of active KPIs linked to this goal.
        
        Args:
            obj: Goal instance
            
        Returns:
            Number of active KPIs
        """
        return obj.get_kpi_count()
