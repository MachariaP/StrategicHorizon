from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Vision, Goal, KPI, NonNegotiable, System, Person,
    Execution, Obstacle, QuarterlyReflection
)


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
        }
    
    def validate(self, attrs):
        """Validate that passwords match"""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return attrs
    
    def create(self, validated_data):
        """Create a new user with encrypted password"""
        # Remove password_confirm as it's not needed for user creation
        validated_data.pop('password_confirm')
        
        # Create user with create_user to properly hash the password
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user


class VisionSerializer(serializers.ModelSerializer):
    """Serializer for Vision model"""
    user = serializers.ReadOnlyField(source='user.id')
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Vision
        fields = [
            'id', 'user', 'username', 'year', 'north_star',
            'yearly_theme', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class KPISerializer(serializers.ModelSerializer):
    """Serializer for KPI model"""
    user = serializers.ReadOnlyField(source='user.id')
    progress_percentage = serializers.ReadOnlyField()

    class Meta:
        model = KPI
        fields = [
            'id', 'user', 'goal', 'name', 'description',
            'target_value', 'actual_value', 'unit',
            'progress_percentage', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'progress_percentage']


class GoalSerializer(serializers.ModelSerializer):
    """Serializer for Goal model"""
    user = serializers.ReadOnlyField(source='user.id')
    username = serializers.ReadOnlyField(source='user.username')
    kpis = KPISerializer(many=True, read_only=True)

    class Meta:
        model = Goal
        fields = [
            'id', 'user', 'username', 'vision', 'title',
            'description', 'status', 'target_date',
            'kpis', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class NonNegotiableSerializer(serializers.ModelSerializer):
    """Serializer for NonNegotiable model"""
    user = serializers.ReadOnlyField(source='user.id')

    class Meta:
        model = NonNegotiable
        fields = [
            'id', 'user', 'title', 'description',
            'frequency', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SystemSerializer(serializers.ModelSerializer):
    """Serializer for System model"""
    user = serializers.ReadOnlyField(source='user.id')

    class Meta:
        model = System
        fields = [
            'id', 'user', 'name', 'description',
            'frequency', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PersonSerializer(serializers.ModelSerializer):
    """Serializer for Person model"""
    user = serializers.ReadOnlyField(source='user.id')

    class Meta:
        model = Person
        fields = [
            'id', 'user', 'name', 'role', 'role_description',
            'contact_info', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ExecutionSerializer(serializers.ModelSerializer):
    """Serializer for Execution model"""
    user = serializers.ReadOnlyField(source='user.id')
    month_display = serializers.ReadOnlyField(source='get_month_display')

    class Meta:
        model = Execution
        fields = [
            'id', 'user', 'goal', 'title', 'description',
            'month', 'month_display', 'year', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'month_display']


class ObstacleSerializer(serializers.ModelSerializer):
    """Serializer for Obstacle model"""
    user = serializers.ReadOnlyField(source='user.id')

    class Meta:
        model = Obstacle
        fields = [
            'id', 'user', 'goal', 'title', 'description',
            'severity', 'mitigation', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class QuarterlyReflectionSerializer(serializers.ModelSerializer):
    """Serializer for QuarterlyReflection model"""
    user = serializers.ReadOnlyField(source='user.id')
    quarter_display = serializers.ReadOnlyField(source='get_quarter_display')

    class Meta:
        model = QuarterlyReflection
        fields = [
            'id', 'user', 'quarter', 'quarter_display', 'year',
            'wins', 'challenges', 'lessons_learned', 'adjustments',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'quarter_display']
