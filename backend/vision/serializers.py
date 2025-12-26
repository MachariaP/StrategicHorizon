from rest_framework import serializers
from .models import Vision


class VisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vision
        fields = ['id', 'year', 'north_star', 'yearly_theme', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
