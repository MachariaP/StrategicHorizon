from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import Goal
from vision.models import Vision
from .serializers import GoalSerializer, GoalListSerializer
import uuid


class GoalModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.vision = Vision.objects.create(
            user=self.user,
            year=2026,
            north_star='This is a comprehensive vision statement with more than ten words to meet validation.',
            yearly_theme='Year of Innovation',
        )
        self.goal = Goal.objects.create(
            user=self.user,
            vision=self.vision,
            title='Test Goal',
            description='Test description',
            confidence_level=4
        )
    
    def test_goal_creation(self):
        """Test that a goal can be created"""
        self.assertEqual(self.goal.user, self.user)
        self.assertEqual(self.goal.vision, self.vision)
        self.assertEqual(self.goal.title, 'Test Goal')
        self.assertFalse(self.goal.is_deleted)
        # Test UUID is set
        self.assertIsInstance(self.goal.id, uuid.UUID)
    
    def test_soft_delete(self):
        """Test soft delete functionality from BaseModel"""
        self.goal.soft_delete()
        self.assertTrue(self.goal.is_deleted)
        self.assertIsNotNone(self.goal.deleted_at)
    
    def test_restore(self):
        """Test restore functionality from BaseModel"""
        self.goal.soft_delete()
        self.assertTrue(self.goal.is_deleted)
        
        self.goal.restore()
        self.assertFalse(self.goal.is_deleted)
        self.assertIsNone(self.goal.deleted_at)
    
    def test_get_progress_percentage(self):
        """Test progress percentage calculation"""
        # Without KPIs, should return 0
        self.assertEqual(self.goal.get_progress_percentage(), 0.0)
        self.assertEqual(self.goal.progress_percentage, 0.0)
    
    def test_get_kpi_count(self):
        """Test that get_kpi_count returns correct count"""
        # Import here to avoid circular dependency
        from kpis.models import KPI
        
        # Initially should be 0
        self.assertEqual(self.goal.get_kpi_count(), 0)
        
        # Create some KPIs
        KPI.objects.create(
            user=self.user,
            goal=self.goal,
            name='Test KPI 1',
            current_value=50,
            target_value=100,
            unit='units'
        )
        KPI.objects.create(
            user=self.user,
            goal=self.goal,
            name='Test KPI 2',
            current_value=75,
            target_value=100,
            unit='units'
        )
        
        self.assertEqual(self.goal.get_kpi_count(), 2)


class GoalSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.vision = Vision.objects.create(
            user=self.user,
            year=2026,
            north_star='This is a comprehensive vision statement with more than ten words to meet validation.',
            yearly_theme='Year of Innovation',
        )
    
    def test_goal_serializer_includes_depth(self):
        """Test that GoalSerializer includes vision_details and kpi_count"""
        goal = Goal.objects.create(
            user=self.user,
            vision=self.vision,
            title='Test Goal',
            description='Test description'
        )
        
        serializer = GoalSerializer(goal)
        self.assertIn('vision_details', serializer.data)
        self.assertIn('kpi_count', serializer.data)
        self.assertEqual(serializer.data['kpi_count'], 0)
        self.assertEqual(serializer.data['vision_details']['id'], str(self.vision.id))
    
    def test_goal_list_serializer_lightweight(self):
        """Test that GoalListSerializer is lightweight without vision_details"""
        goal = Goal.objects.create(
            user=self.user,
            vision=self.vision,
            title='Test Goal',
            description='Test description'
        )
        
        serializer = GoalListSerializer(goal)
        self.assertNotIn('vision_details', serializer.data)
        self.assertIn('kpi_count', serializer.data)
        self.assertIn('vision', serializer.data)


class GoalPermissionTest(APITestCase):
    """Test IsOwner permission on Goal endpoints"""
    
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='testpass')
        self.user2 = User.objects.create_user(username='user2', password='testpass')
        
        self.vision1 = Vision.objects.create(
            user=self.user1,
            year=2026,
            north_star='User 1 vision statement with more than ten words for validation.',
            yearly_theme='User 1 Theme',
        )
        
        self.vision2 = Vision.objects.create(
            user=self.user2,
            year=2026,
            north_star='User 2 vision statement with more than ten words for validation.',
            yearly_theme='User 2 Theme',
        )
        
        self.goal1 = Goal.objects.create(
            user=self.user1,
            vision=self.vision1,
            title='User 1 Goal',
            description='Test description'
        )
        
        self.goal2 = Goal.objects.create(
            user=self.user2,
            vision=self.vision2,
            title='User 2 Goal',
            description='Test description'
        )
        
        self.client = APIClient()
    
    def test_user_can_access_own_goal(self):
        """Test that users can access their own goals"""
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(f'/api/goals/{self.goal1.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_user_cannot_access_others_goal(self):
        """Test that users cannot access other users' goals"""
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(f'/api/goals/{self.goal2.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_user_cannot_modify_others_goal(self):
        """Test that users cannot modify other users' goals"""
        self.client.force_authenticate(user=self.user1)
        response = self.client.patch(
            f'/api/goals/{self.goal2.id}/',
            {'title': 'Hacked Goal'}
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
