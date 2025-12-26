from rest_framework import serializers
from .models import KPI


class KPISerializer(serializers.ModelSerializer):
    progress_percentage = serializers.ReadOnlyField()

    class Meta:
        model = KPI
        fields = ['id', 'goal', 'name', 'description', 'target_value', 'actual_value', 'unit', 'progress_percentage', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
