from rest_framework import serializers
from .models import Goal
from typing import Dict, Any, Optional


class GoalListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing goals - avoids N+1 queries"""
    progress_percentage = serializers.ReadOnlyField()
    kpi_count = serializers.SerializerMethodField(read_only=True)
    sub_goal_count = serializers.SerializerMethodField(read_only=True)
    vision_name = serializers.CharField(source='vision.north_star', read_only=True)
    vision_id = serializers.IntegerField(read_only=True)
    parent_goal_title = serializers.CharField(source='parent_goal.title', read_only=True)
    
    class Meta:
        model = Goal
        fields = [
            'id', 'vision_id', 'vision_name', 'parent_goal', 'parent_goal_title',
            'title', 'strategic_level', 'status', 'confidence_level',
            'target_date', 'progress_percentage', 'kpi_count', 'sub_goal_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'progress_percentage', 'kpi_count', 'sub_goal_count',
            'vision_name', 'vision_id', 'parent_goal_title',
            'created_at', 'updated_at'
        ]
    
    def get_kpi_count(self, obj: Goal) -> int:
        """Optimized count using prefetch_related"""
        return obj.kpis.filter(is_deleted=False).count()
    
    def get_sub_goal_count(self, obj: Goal) -> int:
        """Optimized count using prefetch_related"""
        return obj.sub_goals.filter(is_deleted=False).count()


class GoalSerializer(serializers.ModelSerializer):
    """Full serializer for Goal model with validation rules"""
    progress_percentage = serializers.ReadOnlyField()
    kpi_count = serializers.SerializerMethodField(read_only=True)
    sub_goal_count = serializers.SerializerMethodField(read_only=True)
    vision_name = serializers.CharField(source='vision.north_star', read_only=True)
    vision_year = serializers.IntegerField(source='vision.year', read_only=True)
    
    class Meta:
        model = Goal
        fields = [
            'id', 'vision', 'vision_name', 'vision_year', 'parent_goal',
            'title', 'description', 'status', 'strategic_level',
            'confidence_level', 'target_date', 'weight',
            'progress_percentage', 'kpi_count', 'sub_goal_count',
            'is_deleted', 'deleted_at', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'progress_percentage', 'kpi_count', 'sub_goal_count',
            'vision_name', 'vision_year', 'created_at', 'updated_at',
            'is_deleted', 'deleted_at'
        ]
    
    def get_kpi_count(self, obj: Goal) -> int:
        return obj.get_kpi_count()
    
    def get_sub_goal_count(self, obj: Goal) -> int:
        return obj.get_sub_goal_count()
    
    def validate_vision(self, value: Any) -> Any:
        """Ensure a Goal is linked to a Vision before saving."""
        if value is None:
            raise serializers.ValidationError(
                "A Goal cannot be saved without being linked to a Vision."
            )
        
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            if value.user != request.user:
                raise serializers.ValidationError(
                    "You can only link goals to your own visions."
                )
        
        return value
    
    def validate_confidence_level(self, value: int) -> int:
        if value < 1 or value > 5:
            raise serializers.ValidationError(
                "Confidence level must be between 1 (low) and 5 (high)."
            )
        return value
    
    def validate_weight(self, value: float) -> float:
        if value < 0.0 or value > 10.0:
            raise serializers.ValidationError(
                "Weight must be between 0.0 and 10.0."
            )
        return value
    
    def validate_parent_goal(self, value: Optional[Goal]) -> Optional[Goal]:
        """Validate parent goal constraints"""
        if value:
            request = self.context.get('request')
            if request and hasattr(request, 'user'):
                if value.user != request.user:
                    raise serializers.ValidationError(
                        "Parent goal must belong to you."
                    )
                
                # Get vision from context (might be in validated_data)
                vision = self.initial_data.get('vision')
                if vision and value.vision_id != vision:
                    raise serializers.ValidationError(
                        "Parent goal must belong to the same vision."
                    )
        
        return value
    
    def validate(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Cross-field validation for strategic cascading"""
        # Get strategic_level from data or instance
        strategic_level = data.get('strategic_level')
        if strategic_level is None and self.instance:
            strategic_level = self.instance.strategic_level
        
        # Get parent_goal from data or instance
        parent_goal = data.get('parent_goal')
        if parent_goal is None and self.instance:
            parent_goal = self.instance.parent_goal
        
        if strategic_level == 'high' and parent_goal:
            parent_strategic_level = parent_goal.strategic_level
            if parent_strategic_level == 'high':
                raise serializers.ValidationError({
                    'parent_goal': "High-level goals cannot have high-level parent goals."
                })
        
        return data
    
    def create(self, validated_data: Dict[str, Any]) -> Goal:
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)