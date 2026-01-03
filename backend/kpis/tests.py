from django.test import TestCase
from django.contrib.auth.models import User
from kpis.models import KPI, KPIHistory
from goals.models import Goal
from vision.models import Vision
from rest_framework.test import APITestCase, APIClient
from rest_framework import status


class KPIHistoryModelTest(TestCase):
    """Test KPIHistory model functionality"""
    
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
        self.kpi = KPI.objects.create(
            user=self.user,
            goal=self.goal,
            name='Test KPI',
            current_value=50,
            target_value=100,
            unit='units'
        )
    
    def test_kpi_history_creation(self):
        """Test that KPIHistory can be created"""
        history = KPIHistory.objects.create(
            kpi=self.kpi,
            value=50
        )
        self.assertEqual(history.kpi, self.kpi)
        self.assertEqual(history.value, 50)
        self.assertIsNotNone(history.recorded_at)
    
    def test_kpi_history_signal_on_create(self):
        """Test that signal creates history entry on KPI creation"""
        # Creating a KPI should trigger the signal
        new_kpi = KPI.objects.create(
            user=self.user,
            goal=self.goal,
            name='Signal Test KPI',
            current_value=75,
            target_value=100,
            unit='units'
        )
        
        # Check that history was created
        history_count = KPIHistory.objects.filter(kpi=new_kpi).count()
        self.assertEqual(history_count, 1)
        
        history = KPIHistory.objects.get(kpi=new_kpi)
        self.assertEqual(float(history.value), 75)
    
    def test_kpi_get_history_trend_data(self):
        """Test get_history_trend_data method"""
        # Create some history entries
        KPIHistory.objects.create(kpi=self.kpi, value=30)
        KPIHistory.objects.create(kpi=self.kpi, value=40)
        KPIHistory.objects.create(kpi=self.kpi, value=50)
        
        trend_data = self.kpi.get_history_trend_data()
        
        self.assertEqual(len(trend_data), 3)
        self.assertIn('date', trend_data[0])
        self.assertIn('value', trend_data[0])
        self.assertEqual(trend_data[-1]['value'], 50)


class KPIProgressAggregationTest(TestCase):
    """Test Goal progress aggregation from KPIs"""
    
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
    
    def test_goal_progress_from_single_kpi(self):
        """Test that goal progress is calculated from a single KPI"""
        KPI.objects.create(
            user=self.user,
            goal=self.goal,
            name='KPI 1',
            current_value=50,
            target_value=100,
            unit='units'
        )
        
        self.assertEqual(self.goal.progress_percentage, 50.0)
    
    def test_goal_progress_from_multiple_kpis(self):
        """Test that goal progress is average of multiple KPIs"""
        KPI.objects.create(
            user=self.user,
            goal=self.goal,
            name='KPI 1',
            current_value=50,
            target_value=100,
            unit='units'
        )
        KPI.objects.create(
            user=self.user,
            goal=self.goal,
            name='KPI 2',
            current_value=75,
            target_value=100,
            unit='units'
        )
        KPI.objects.create(
            user=self.user,
            goal=self.goal,
            name='KPI 3',
            current_value=100,
            target_value=100,
            unit='units'
        )
        
        # Average should be (50 + 75 + 100) / 3 = 75
        self.assertEqual(self.goal.progress_percentage, 75.0)
    
    def test_goal_progress_ignores_deleted_kpis(self):
        """Test that soft-deleted KPIs don't affect progress"""
        kpi1 = KPI.objects.create(
            user=self.user,
            goal=self.goal,
            name='KPI 1',
            current_value=50,
            target_value=100,
            unit='units'
        )
        kpi2 = KPI.objects.create(
            user=self.user,
            goal=self.goal,
            name='KPI 2',
            current_value=100,
            target_value=100,
            unit='units'
        )
        
        # Should be (50 + 100) / 2 = 75
        self.assertEqual(self.goal.progress_percentage, 75.0)
        
        # Soft delete kpi2
        kpi2.is_deleted = True
        kpi2.save()
        
        # Now should only count kpi1: 50%
        self.assertEqual(self.goal.progress_percentage, 50.0)


class KPISerializerTest(APITestCase):
    """Test KPI serializer with history_trend_data"""
    
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
        self.kpi = KPI.objects.create(
            user=self.user,
            goal=self.goal,
            name='Test KPI',
            current_value=50,
            target_value=100,
            unit='units'
        )
        
        # Create history
        KPIHistory.objects.create(kpi=self.kpi, value=30)
        KPIHistory.objects.create(kpi=self.kpi, value=40)
        
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
    
    def test_kpi_serializer_includes_history_trend_data(self):
        """Test that serializer includes history_trend_data field"""
        response = self.client.get(f'/api/kpis/{self.kpi.id}/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('history_trend_data', response.data)
        self.assertIsInstance(response.data['history_trend_data'], list)
        self.assertGreaterEqual(len(response.data['history_trend_data']), 2)

