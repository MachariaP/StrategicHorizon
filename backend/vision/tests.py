from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import Vision
from .serializers import VisionSerializer
import uuid


class VisionModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.vision = Vision.objects.create(
            user=self.user,
            year=2026,
            north_star='This is a comprehensive vision statement with more than ten words to meet validation requirements.',
            yearly_theme='Year of Innovation',
            time_horizon=5,
            five_whys=['Why 1', 'Why 2', 'Why 3']
        )

    def test_vision_creation(self):
        """Test that a vision can be created"""
        self.assertEqual(self.vision.user, self.user)
        self.assertEqual(self.vision.year, 2026)
        self.assertEqual(self.vision.time_horizon, 5)
        self.assertFalse(self.vision.is_deleted)
        self.assertTrue(self.vision.is_active)
        # Test UUID is set
        self.assertIsInstance(self.vision.id, uuid.UUID)

    def test_soft_delete(self):
        """Test soft delete functionality"""
        self.vision.soft_delete()
        self.assertTrue(self.vision.is_deleted)
        self.assertIsNotNone(self.vision.deleted_at)

    def test_restore(self):
        """Test restore functionality"""
        self.vision.soft_delete()
        self.assertTrue(self.vision.is_deleted)
        
        self.vision.restore()
        self.assertFalse(self.vision.is_deleted)
        self.assertIsNone(self.vision.deleted_at)

    def test_vision_manager(self):
        """Test custom manager filters deleted visions"""
        # Create a deleted vision
        deleted_vision = Vision.objects.create(
            user=self.user,
            year=2025,
            north_star='Old vision with sufficient words to pass validation check here.',
            yearly_theme='Year of Past',
            time_horizon=1
        )
        deleted_vision.soft_delete()
        
        # Check that default manager doesn't include deleted
        active_visions = Vision.objects.filter(user=self.user)
        self.assertEqual(active_visions.count(), 1)
        self.assertNotIn(deleted_vision, active_visions)
        
        # Check that all_objects includes deleted
        all_visions = Vision.all_objects.filter(user=self.user)
        self.assertEqual(all_visions.count(), 2)
        
        # Check archived method
        archived_visions = Vision.objects.archived().filter(user=self.user)
        self.assertEqual(archived_visions.count(), 1)
        self.assertIn(deleted_vision, archived_visions)
    
    def test_get_goal_count(self):
        """Test that get_goal_count returns correct count"""
        # Import here to avoid circular dependency
        from goals.models import Goal
        
        # Create some goals
        Goal.objects.create(
            user=self.user,
            vision=self.vision,
            title='Test Goal 1',
            description='Test description'
        )
        Goal.objects.create(
            user=self.user,
            vision=self.vision,
            title='Test Goal 2',
            description='Test description'
        )
        
        self.assertEqual(self.vision.get_goal_count(), 2)


class VisionSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')

    def test_north_star_validation(self):
        """Test that North Star validation works"""
        # Too short
        serializer = VisionSerializer(data={
            'year': 2026,
            'north_star': 'Too short',
            'yearly_theme': 'Test',
            'time_horizon': 1
        })
        self.assertFalse(serializer.is_valid())
        self.assertIn('north_star', serializer.errors)
        
        # Valid length
        serializer = VisionSerializer(data={
            'year': 2026,
            'north_star': 'This is a proper vision statement with more than ten words to ensure validation passes.',
            'yearly_theme': 'Test',
            'time_horizon': 1
        })
        # Call is_valid first
        is_valid = serializer.is_valid()
        # Should not have north_star errors
        self.assertNotIn('north_star', serializer.errors)

    def test_five_whys_validation(self):
        """Test that five_whys validation works"""
        # Valid five_whys
        serializer = VisionSerializer(data={
            'year': 2026,
            'north_star': 'Valid vision statement with at least ten words here to pass validation.',
            'yearly_theme': 'Test',
            'time_horizon': 1,
            'five_whys': ['Why 1', 'Why 2', 'Why 3']
        })
        # Should not have five_whys errors
        if not serializer.is_valid():
            self.assertNotIn('five_whys', serializer.errors)
        
        # Too many whys
        serializer = VisionSerializer(data={
            'year': 2026,
            'north_star': 'Valid vision statement with at least ten words here to pass validation.',
            'yearly_theme': 'Test',
            'time_horizon': 1,
            'five_whys': ['Why 1', 'Why 2', 'Why 3', 'Why 4', 'Why 5', 'Why 6']
        })
        self.assertFalse(serializer.is_valid())
        self.assertIn('five_whys', serializer.errors)


class VisionPermissionTest(APITestCase):
    """Test IsOwner permission on Vision endpoints"""
    
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
        
        self.client = APIClient()
    
    def test_user_can_access_own_vision(self):
        """Test that users can access their own visions"""
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(f'/api/vision/{self.vision1.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_user_cannot_access_others_vision(self):
        """Test that users cannot access other users' visions"""
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(f'/api/vision/{self.vision2.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_user_cannot_modify_others_vision(self):
        """Test that users cannot modify other users' visions"""
        self.client.force_authenticate(user=self.user1)
        response = self.client.patch(
            f'/api/vision/{self.vision2.id}/',
            {'yearly_theme': 'Hacked Theme'}
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
