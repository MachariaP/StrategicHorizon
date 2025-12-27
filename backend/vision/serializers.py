from rest_framework import serializers
from .models import Vision
from typing import Dict, Any


class VisionSerializer(serializers.ModelSerializer):
    time_horizon_display = serializers.CharField(source='get_time_horizon_display', read_only=True)
    goal_count = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Vision
        fields = [
            'id', 'year', 'north_star', 'yearly_theme', 'time_horizon', 
            'time_horizon_display', 'five_whys', 'is_active', 'is_deleted', 
            'deleted_at', 'visual_url', 'created_at', 'updated_at', 'goal_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'deleted_at', 'is_deleted', 'goal_count']
    
    def get_goal_count(self, obj: Vision) -> int:
        """
        Get the count of active goals linked to this vision.
        
        Args:
            obj: Vision instance
            
        Returns:
            Number of active goals
        """
        return obj.get_goal_count()

    def validate_north_star(self, value: str) -> str:
        """Ensure North Star has sufficient depth (minimum word count)"""
        if not value:
            raise serializers.ValidationError("North Star statement is required.")
        
        word_count = len(value.split())
        if word_count < 10:
            raise serializers.ValidationError(
                f"North Star statement should be at least 10 words to encourage deep thinking. "
                f"Current word count: {word_count}"
            )
        return value
    
    def validate_five_whys(self, value: list) -> list:
        """Validate five_whys structure"""
        if value and not isinstance(value, list):
            raise serializers.ValidationError("Five whys must be a list of strings.")
        
        if value and len(value) > 5:
            raise serializers.ValidationError("You can have at most 5 'why' statements.")
        
        # Validate each why is a non-empty string
        for i, why in enumerate(value or []):
            if not isinstance(why, str) or not why.strip():
                raise serializers.ValidationError(f"Why statement {i+1} must be a non-empty string.")
        
        return value

    def create(self, validated_data: Dict[str, Any]) -> Vision:
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class VisionArchiveSerializer(serializers.ModelSerializer):
    """Serializer for archived visions with read-only fields"""
    time_horizon_display = serializers.CharField(source='get_time_horizon_display', read_only=True)
    goal_count = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Vision
        fields = [
            'id', 'year', 'north_star', 'yearly_theme', 'time_horizon',
            'time_horizon_display', 'five_whys', 'deleted_at', 'visual_url',
            'created_at', 'updated_at', 'goal_count'
        ]
        read_only_fields = fields
    
    def get_goal_count(self, obj: Vision) -> int:
        """
        Get the count of active goals linked to this vision.
        
        Args:
            obj: Vision instance
            
        Returns:
            Number of active goals
        """
        return obj.get_goal_count()
