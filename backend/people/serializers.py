from rest_framework import serializers
from .models import Person


class PersonSerializer(serializers.ModelSerializer):
    """Serializer for Person model with relationship tracking."""
    needs_contact = serializers.ReadOnlyField()
    days_until_contact = serializers.ReadOnlyField()
    
    class Meta:
        model = Person
        fields = [
            'id', 'name', 'role', 'role_description', 
            'contact_info', 'notes',
            'relationship_depth', 'last_contact_date', 
            'frequency_days', 'needs_contact', 'days_until_contact',
            'is_deleted', 'deleted_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'needs_contact', 'days_until_contact', 'created_at', 'updated_at', 'is_deleted', 'deleted_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
