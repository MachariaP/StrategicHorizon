from rest_framework import serializers
from .models import NonNegotiable


class NonNegotiableSerializer(serializers.ModelSerializer):
    class Meta:
        model = NonNegotiable
        fields = ['id', 'title', 'description', 'frequency', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
