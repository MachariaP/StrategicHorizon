from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory
from rest_framework.request import Request
from core.permissions import IsOwner
from core.pagination import StandardLimitOffsetPagination
from vision.models import Vision


class BaseModelTest(TestCase):
    """Test BaseModel functionality through Vision model"""
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.vision = Vision.objects.create(
            user=self.user,
            year=2026,
            north_star='Test vision statement with more than ten words to meet validation requirements.',
            yearly_theme='Test Theme'
        )
    
    def test_uuid_primary_key(self):
        """Test that models using BaseModel have UUID primary keys"""
        import uuid
        self.assertIsInstance(self.vision.id, uuid.UUID)
    
    def test_timestamps(self):
        """Test that created_at and updated_at are set"""
        self.assertIsNotNone(self.vision.created_at)
        self.assertIsNotNone(self.vision.updated_at)
    
    def test_soft_delete(self):
        """Test soft delete functionality from BaseModel"""
        self.assertFalse(self.vision.is_deleted)
        self.assertIsNone(self.vision.deleted_at)
        
        self.vision.soft_delete()
        
        self.assertTrue(self.vision.is_deleted)
        self.assertIsNotNone(self.vision.deleted_at)
    
    def test_restore(self):
        """Test restore functionality from BaseModel"""
        self.vision.soft_delete()
        self.assertTrue(self.vision.is_deleted)
        
        self.vision.restore()
        
        self.assertFalse(self.vision.is_deleted)
        self.assertIsNone(self.vision.deleted_at)
    
    def test_base_model_manager(self):
        """Test that BaseModel manager filters soft deleted objects"""
        # Create another vision and soft delete it
        deleted_vision = Vision.objects.create(
            user=self.user,
            year=2025,
            north_star='Deleted vision statement with more than ten words to meet requirements.',
            yearly_theme='Deleted Theme'
        )
        deleted_vision.soft_delete()
        
        # Default manager should only return non-deleted
        active_visions = Vision.objects.all()
        self.assertEqual(active_visions.count(), 1)
        self.assertIn(self.vision, active_visions)
        self.assertNotIn(deleted_vision, active_visions)
        
        # all_objects should return all
        all_visions = Vision.all_objects.all()
        self.assertEqual(all_visions.count(), 2)


class IsOwnerPermissionTest(TestCase):
    """Test IsOwner permission class"""
    
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='testpass')
        self.user2 = User.objects.create_user(username='user2', password='testpass')
        
        self.vision1 = Vision.objects.create(
            user=self.user1,
            year=2026,
            north_star='User 1 vision statement with more than ten words for validation.',
            yearly_theme='User 1 Theme'
        )
        
        self.vision2 = Vision.objects.create(
            user=self.user2,
            year=2026,
            north_star='User 2 vision statement with more than ten words for validation.',
            yearly_theme='User 2 Theme'
        )
        
        self.permission = IsOwner()
        self.factory = APIRequestFactory()
    
    def test_owner_has_permission(self):
        """Test that owner has permission to access their object"""
        request = self.factory.get('/')
        request.user = self.user1
        
        self.assertTrue(
            self.permission.has_object_permission(request, None, self.vision1)
        )
    
    def test_non_owner_denied_permission(self):
        """Test that non-owner is denied permission"""
        request = self.factory.get('/')
        request.user = self.user1
        
        self.assertFalse(
            self.permission.has_object_permission(request, None, self.vision2)
        )
    
    def test_object_without_user_field_denied(self):
        """Test that objects without user field are denied"""
        request = self.factory.get('/')
        request.user = self.user1
        
        # Create a mock object without user field
        class MockObject:
            pass
        
        mock_obj = MockObject()
        
        self.assertFalse(
            self.permission.has_object_permission(request, None, mock_obj)
        )


class StandardLimitOffsetPaginationTest(TestCase):
    """Test StandardLimitOffsetPagination"""
    
    def test_pagination_settings(self):
        """Test pagination has correct settings"""
        pagination = StandardLimitOffsetPagination()
        
        self.assertEqual(pagination.default_limit, 20)
        self.assertEqual(pagination.max_limit, 100)
        self.assertEqual(pagination.limit_query_param, 'limit')
        self.assertEqual(pagination.offset_query_param, 'offset')
