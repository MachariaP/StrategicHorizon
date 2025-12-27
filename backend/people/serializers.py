from rest_framework import serializers
from .models import Person
from typing import Dict, Any


class PersonSerializer(serializers.ModelSerializer):
    """Serializer for Person model with relationship tracking."""
    needs_contact = serializers.ReadOnlyField()
    days_until_contact = serializers.ReadOnlyField()
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    relationship_depth_display = serializers.CharField(source='get_relationship_depth_display', read_only=True)
    
    class Meta:
        model = Person
        fields = [
            'id', 'name', 'role', 'role_display', 'role_description', 
            'contact_info', 'notes',
            'relationship_depth', 'relationship_depth_display',
            'last_contact_date', 'frequency_days', 
            'needs_contact', 'days_until_contact',
            'is_deleted', 'deleted_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'needs_contact', 'days_until_contact', 'role_display',
            'relationship_depth_display', 'created_at', 'updated_at', 
            'is_deleted', 'deleted_at'
        ]

    def create(self, validated_data: Dict[str, Any]) -> Person:
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
