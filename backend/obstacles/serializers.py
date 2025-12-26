from rest_framework import serializers
from .models import Obstacle


class ObstacleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Obstacle
        fields = ['id', 'goal', 'title', 'description', 'severity', 'mitigation', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
