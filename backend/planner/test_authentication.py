from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status


class UserRegistrationTest(TestCase):
    """Test user registration endpoint"""

    def setUp(self):
        """Set up test client"""
        self.client = APIClient()

    def test_register_user_success(self):
        """Test successful user registration"""
        response = self.client.post('/api/register/', {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'securepass123',
            'password_confirm': 'securepass123',
            'first_name': 'New',
            'last_name': 'User'
        })
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('id', response.data)
        self.assertEqual(response.data['username'], 'newuser')
        self.assertEqual(response.data['email'], 'newuser@example.com')
        
        # Verify user was created in database
        user = User.objects.get(username='newuser')
        self.assertEqual(user.email, 'newuser@example.com')
        self.assertTrue(user.check_password('securepass123'))

    def test_register_user_password_mismatch(self):
        """Test registration fails when passwords don't match"""
        response = self.client.post('/api/register/', {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'securepass123',
            'password_confirm': 'differentpass123'
        })
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_register_user_duplicate_username(self):
        """Test registration fails with duplicate username"""
        # Create a user first
        User.objects.create_user(
            username='existinguser',
            email='existing@example.com',
            password='password123'
        )
        
        # Try to create another user with the same username
        response = self.client.post('/api/register/', {
            'username': 'existinguser',
            'email': 'newemail@example.com',
            'password': 'securepass123',
            'password_confirm': 'securepass123'
        })
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_register_user_missing_email(self):
        """Test registration fails when email is missing"""
        response = self.client.post('/api/register/', {
            'username': 'newuser',
            'password': 'securepass123',
            'password_confirm': 'securepass123'
        })
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_register_user_short_password(self):
        """Test registration fails with password less than 8 characters"""
        response = self.client.post('/api/register/', {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'short',
            'password_confirm': 'short'
        })
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_login_after_registration(self):
        """Test that newly registered user can log in"""
        # Register a new user
        self.client.post('/api/register/', {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'securepass123',
            'password_confirm': 'securepass123'
        })
        
        # Try to log in with the new credentials
        response = self.client.post('/api/token/', {
            'username': 'newuser',
            'password': 'securepass123'
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)


class TokenAuthenticationTest(TestCase):
    """Test JWT token authentication endpoints"""

    def setUp(self):
        """Set up test user and client"""
        self.client = APIClient()
        self.username = 'testuser'
        self.password = 'testpass123'
        self.user = User.objects.create_user(
            username=self.username,
            password=self.password,
            email='test@example.com'
        )

    def test_obtain_token_pair_success(self):
        """Test obtaining token pair with valid credentials"""
        response = self.client.post('/api/token/', {
            'username': self.username,
            'password': self.password
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIsNotNone(response.data['access'])
        self.assertIsNotNone(response.data['refresh'])

    def test_obtain_token_pair_invalid_credentials(self):
        """Test obtaining token pair with invalid credentials"""
        response = self.client.post('/api/token/', {
            'username': self.username,
            'password': 'wrongpassword'
        })
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_token_success(self):
        """Test refreshing access token with valid refresh token"""
        # First, obtain tokens
        token_response = self.client.post('/api/token/', {
            'username': self.username,
            'password': self.password
        })
        refresh_token = token_response.data['refresh']
        
        # Now, refresh the access token
        refresh_response = self.client.post('/api/token/refresh/', {
            'refresh': refresh_token
        })
        
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        self.assertIn('access', refresh_response.data)
        self.assertIsNotNone(refresh_response.data['access'])

    def test_protected_endpoint_without_token(self):
        """Test accessing protected endpoint without authentication token"""
        # Assuming /api/visions/ requires authentication
        response = self.client.get('/api/visions/')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_protected_endpoint_with_token(self):
        """Test accessing protected endpoint with valid authentication token"""
        # Obtain token
        token_response = self.client.post('/api/token/', {
            'username': self.username,
            'password': self.password
        })
        access_token = token_response.data['access']
        
        # Access protected endpoint with token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.get('/api/visions/')
        
        # Should return 200 OK (or 200 with empty list, not 401)
        self.assertNotEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
