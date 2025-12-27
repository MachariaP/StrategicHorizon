from rest_framework import serializers
from .models import QuarterlyReflection
from django.utils import timezone
from datetime import timedelta


class QuarterlyReflectionSerializer(serializers.ModelSerializer):
    """Serializer for QuarterlyReflection model with immutability after 24 hours."""
    can_edit = serializers.ReadOnlyField()
    time_until_lock = serializers.SerializerMethodField()
    
    class Meta:
        model = QuarterlyReflection
        fields = [
            'id', 'reflection_type', 'quarter', 'year', 
            'week_number', 'month',
            'wins', 'challenges', 'lessons_learned', 
            'adjustments', 'gratitude_log',
            'is_locked', 'locked_at', 'can_edit', 'time_until_lock',
            'is_deleted', 'deleted_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'is_locked', 'locked_at', 'can_edit', 
            'time_until_lock', 'created_at', 'updated_at',
            'is_deleted', 'deleted_at'
        ]
    
    def get_time_until_lock(self, obj):
        """Return time until lock in seconds."""
        if obj.is_locked or not obj.created_at:
            return 0
        
        time_since_creation = timezone.now() - obj.created_at
        time_remaining = timedelta(hours=24) - time_since_creation
        return max(int(time_remaining.total_seconds()), 0)
    
    def validate(self, data):
        """Prevent editing of locked reflections."""
        if self.instance and self.instance.is_locked:
            raise serializers.ValidationError(
                "This reflection is locked and cannot be edited. "
                "Reflections become immutable 24 hours after creation to preserve historical integrity."
            )
        
        # For quarterly reflections, quarter is required
        reflection_type = data.get('reflection_type', getattr(self.instance, 'reflection_type', None))
        if reflection_type == 'quarterly' and not data.get('quarter') and not (self.instance and self.instance.quarter):
            raise serializers.ValidationError({
                'quarter': 'Quarter is required for quarterly reflections.'
            })
        
        # For monthly reflections, month is required
        if reflection_type == 'monthly' and not data.get('month') and not (self.instance and self.instance.month):
            raise serializers.ValidationError({
                'month': 'Month is required for monthly reflections.'
            })
        
        # For weekly reflections, week_number is required
        if reflection_type == 'weekly' and not data.get('week_number') and not (self.instance and self.instance.week_number):
            raise serializers.ValidationError({
                'week_number': 'Week number is required for weekly reflections.'
            })
        
        return data

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Override update to enforce immutability."""
        if instance.is_locked:
            raise serializers.ValidationError(
                "This reflection is locked and cannot be edited."
            )
        return super().update(instance, validated_data)
