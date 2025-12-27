"""
Tests for enhanced backend features - Strategic Operating System Integration
"""
import os
import sys
import django

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Configure Django settings for testing with SQLite
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'strategic_horizon.settings')

# Override database settings for testing
from django.conf import settings
settings.DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

django.setup()

from django.test import TestCase
from django.contrib.auth.models import User
from vision.models import Vision
from goals.models import Goal
from kpis.models import KPI
from obstacles.models import Obstacle


class VisionHealthScoreTest(TestCase):
    """Test Vision health_score calculation"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.vision = Vision.objects.create(
            user=self.user,
            year=2026,
            north_star='This is a comprehensive vision statement with more than ten words to meet validation.',
            yearly_theme='Year of Testing',
        )
    
    def test_health_score_with_no_goals(self):
        """Health score should be 0 when there are no goals"""
        self.assertEqual(self.vision.health_score, 0.0)
    
    def test_health_score_with_completed_goals(self):
        """Health score should be 100 with all completed goals"""
        Goal.objects.create(
            user=self.user,
            vision=self.vision,
            title='Goal 1',
            description='Test',
            status='completed'
        )
        Goal.objects.create(
            user=self.user,
            vision=self.vision,
            title='Goal 2',
            description='Test',
            status='completed'
        )
        self.assertEqual(self.vision.health_score, 100.0)
    
    def test_health_score_mixed_status(self):
        """Health score should be weighted average with mixed statuses"""
        # Create goals with different statuses
        Goal.objects.create(
            user=self.user,
            vision=self.vision,
            title='Completed Goal',
            description='Test',
            status='completed'  # 100 points
        )
        Goal.objects.create(
            user=self.user,
            vision=self.vision,
            title='In Progress Goal',
            description='Test',
            status='in_progress'  # 60 points
        )
        Goal.objects.create(
            user=self.user,
            vision=self.vision,
            title='Pending Goal',
            description='Test',
            status='pending'  # 30 points
        )
        Goal.objects.create(
            user=self.user,
            vision=self.vision,
            title='Stalled Goal',
            description='Test',
            status='stalled'  # 0 points
        )
        # Expected: (100 + 60 + 30 + 0) / 4 = 47.5
        self.assertEqual(self.vision.health_score, 47.5)


class GoalProgressPercentageTest(TestCase):
    """Test Goal progress_percentage calculation from KPIs"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.vision = Vision.objects.create(
            user=self.user,
            year=2026,
            north_star='This is a comprehensive vision statement with more than ten words to meet validation.',
            yearly_theme='Year of Testing',
        )
        self.goal = Goal.objects.create(
            user=self.user,
            vision=self.vision,
            title='Test Goal',
            description='Test description'
        )
    
    def test_progress_with_no_kpis(self):
        """Progress should be 0 with no KPIs"""
        self.assertEqual(self.goal.progress_percentage, 0.0)
    
    def test_progress_with_one_kpi(self):
        """Progress should match KPI percentage"""
        KPI.objects.create(
            user=self.user,
            goal=self.goal,
            name='Test KPI',
            current_value=50,
            target_value=100,
            unit='units'
        )
        self.assertEqual(self.goal.progress_percentage, 50.0)
    
    def test_progress_with_multiple_kpis(self):
        """Progress should be average of all KPIs"""
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
        # Expected: (50 + 75) / 2 = 62.5
        self.assertEqual(self.goal.progress_percentage, 62.5)


class ObstacleGoalBlockingTest(TestCase):
    """Test Obstacle blocking Goal functionality"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.vision = Vision.objects.create(
            user=self.user,
            year=2026,
            north_star='This is a comprehensive vision statement with more than ten words to meet validation.',
            yearly_theme='Year of Testing',
        )
        self.goal = Goal.objects.create(
            user=self.user,
            vision=self.vision,
            title='Test Goal',
            description='Test description',
            status='in_progress'
        )
    
    def test_critical_obstacle_stalls_goal(self):
        """Critical obstacle should automatically stall the goal"""
        Obstacle.objects.create(
            user=self.user,
            goal=self.goal,
            title='Critical Issue',
            description='A critical problem',
            severity='critical'
        )
        # Refresh goal from database
        self.goal.refresh_from_db()
        self.assertEqual(self.goal.status, 'stalled')
    
    def test_non_critical_obstacle_does_not_stall(self):
        """Non-critical obstacle should not affect goal status"""
        original_status = self.goal.status
        Obstacle.objects.create(
            user=self.user,
            goal=self.goal,
            title='Minor Issue',
            description='A minor problem',
            severity='medium'
        )
        # Refresh goal from database
        self.goal.refresh_from_db()
        self.assertEqual(self.goal.status, original_status)


if __name__ == '__main__':
    import unittest
    
    # Create test suite
    suite = unittest.TestSuite()
    suite.addTest(unittest.makeSuite(VisionHealthScoreTest))
    suite.addTest(unittest.makeSuite(GoalProgressPercentageTest))
    suite.addTest(unittest.makeSuite(ObstacleGoalBlockingTest))
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Exit with appropriate code
    sys.exit(0 if result.wasSuccessful() else 1)
