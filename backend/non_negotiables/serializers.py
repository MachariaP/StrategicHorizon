from rest_framework import serializers
from .models import NonNegotiable


class NonNegotiableSerializer(serializers.ModelSerializer):
    """Serializer for NonNegotiable model. Non-negotiables are binary by nature."""
    
    class Meta:
        model = NonNegotiable
        fields = [
            'id', 'title', 'description', 'frequency', 
            'is_binary', 'is_deleted', 'deleted_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'is_binary', 'created_at', 'updated_at', 'is_deleted', 'deleted_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
