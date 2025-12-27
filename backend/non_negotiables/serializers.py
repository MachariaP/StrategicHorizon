from rest_framework import serializers
from .models import NonNegotiable
from typing import Dict, Any


class NonNegotiableSerializer(serializers.ModelSerializer):
    """Serializer for NonNegotiable model. Non-negotiables are binary by nature."""
    frequency_display = serializers.CharField(source='get_frequency_display', read_only=True)
    
    class Meta:
        model = NonNegotiable
        fields = [
            'id', 'title', 'description', 'frequency', 'frequency_display',
            'is_binary', 'is_deleted', 'deleted_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'is_binary', 'frequency_display', 
            'created_at', 'updated_at', 'is_deleted', 'deleted_at'
        ]

    def create(self, validated_data: Dict[str, Any]) -> NonNegotiable:
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
