"""
Strategic Service - The "Global Context" Service
Calculates relationships and implements business logic across the Strategic Horizon system.
"""
from typing import Optional, List, Dict, Any
from django.contrib.auth.models import User
from django.db.models import Q, QuerySet
import logging

logger = logging.getLogger(__name__)


class StrategicService:
    """
    Service class that calculates relationships and enforces business rules
    across the Strategic Operating System.
    
    Example: If an Obstacle severity is "Critical," automatically update
    the linked Goal status to STALLED.
    """
    
    @staticmethod
    def check_critical_obstacles_for_goal(goal) -> bool:
        """
        Check if a goal has any critical obstacles and update status accordingly.
        
        Args:
            goal: Goal instance to check
            
        Returns:
            bool: True if goal was stalled due to critical obstacles
        """
        from obstacles.models import Obstacle
        from goals.models import Goal
        
        critical_obstacles = Obstacle.objects.filter(
            goal=goal,
            severity='critical'
        ).exists()
        
        if critical_obstacles and goal.status != 'stalled':
            goal.status = 'stalled'
            goal.save()
            logger.info(f"Goal {goal.id} automatically stalled due to critical obstacles")
            return True
        
        return False
    
    @staticmethod
    def calculate_goal_progress(goal) -> float:
        """
        Calculate goal progress based on linked KPIs.
        
        Args:
            goal: Goal instance
            
        Returns:
            float: Progress percentage (0-100)
        """
        from kpis.models import KPI
        
        kpis = KPI.objects.filter(goal=goal)
        if not kpis.exists():
            return 0.0
        
        total_progress = sum(kpi.progress_percentage for kpi in kpis)
        return total_progress / kpis.count()
    
    @staticmethod
    def get_vision_dashboard_context(user: User, year: Optional[int] = None) -> Dict[str, Any]:
        """
        Prefetch Vision with all Goals and their KPIs for Dashboard.
        Optimized single-query approach.
        
        Args:
            user: User instance
            year: Optional year filter
            
        Returns:
            Dictionary with vision, goals, and KPIs
        """
        from vision.models import Vision
        from goals.models import Goal
        from kpis.models import KPI
        from django.utils import timezone
        
        # Get active vision for the year
        query = Vision.objects.filter(user=user, is_active=True)
        if year:
            query = query.filter(year=year)
        else:
            query = query.filter(year=timezone.now().year)
        
        vision = query.select_related().prefetch_related(
            'goals',
            'goals__kpis'
        ).first()
        
        if not vision:
            return {
                'vision': None,
                'goals': [],
                'total_kpis': 0,
                'average_progress': 0
            }
        
        goals = list(vision.goals.all())
        total_kpis = sum(goal.kpis.count() for goal in goals)
        
        # Calculate average KPI progress
        all_kpis = []
        for goal in goals:
            all_kpis.extend(list(goal.kpis.all()))
        
        if all_kpis:
            average_progress = sum(kpi.progress_percentage for kpi in all_kpis) / len(all_kpis)
        else:
            average_progress = 0
        
        return {
            'vision': vision,
            'goals': goals,
            'total_kpis': total_kpis,
            'average_progress': average_progress
        }
    
    @staticmethod
    def check_people_contact_notifications(user: User) -> List[Dict[str, Any]]:
        """
        Check for people who haven't been contacted within their frequency days.
        Returns list of people needing contact.
        
        Args:
            user: User instance
            
        Returns:
            List of dictionaries with person and days overdue
        """
        from people.models import Person
        from django.utils import timezone
        from datetime import timedelta
        
        notifications = []
        people = Person.objects.filter(user=user)
        
        for person in people:
            if not hasattr(person, 'last_contact_date') or not hasattr(person, 'frequency_days'):
                continue
                
            if person.last_contact_date and person.frequency_days:
                days_since_contact = (timezone.now().date() - person.last_contact_date).days
                if days_since_contact >= person.frequency_days:
                    notifications.append({
                        'person': person,
                        'days_overdue': days_since_contact - person.frequency_days
                    })
        
        return notifications
    
    @staticmethod
    def calculate_system_health(system) -> str:
        """
        Calculate system health based on execution frequency.
        
        Args:
            system: System instance
            
        Returns:
            str: Health status ('healthy', 'warning', 'critical')
        """
        from django.utils import timezone
        
        if not hasattr(system, 'last_execution_date'):
            return 'unknown'
        
        if not system.last_execution_date:
            return 'critical'
        
        days_since_execution = (timezone.now().date() - system.last_execution_date).days
        
        # Map frequency to expected days
        frequency_map = {
            'daily': 1,
            'weekly': 7,
            'monthly': 30
        }
        
        expected_days = frequency_map.get(system.frequency.lower(), 7)
        
        if days_since_execution <= expected_days:
            return 'healthy'
        elif days_since_execution <= expected_days * 2:
            return 'warning'
        else:
            return 'critical'
    
    @staticmethod
    def validate_goal_vision_link(goal_data: Dict[str, Any], user: User) -> tuple[bool, Optional[str]]:
        """
        Validate that a goal is linked to a vision before saving.
        
        Args:
            goal_data: Dictionary with goal data
            user: User instance
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        if not goal_data.get('vision'):
            return False, "A Goal cannot be saved without being linked to a Vision."
        
        from vision.models import Vision
        
        try:
            vision = Vision.objects.get(id=goal_data['vision'], user=user)
            return True, None
        except Vision.DoesNotExist:
            return False, "The specified Vision does not exist or does not belong to you."
