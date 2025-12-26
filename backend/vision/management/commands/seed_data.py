from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from vision.models import Vision
from goals.models import Goal
from kpis.models import KPI
from non_negotiables.models import NonNegotiable
from systems.models import System
from people.models import Person
from executions.models import Execution
from obstacles.models import Obstacle
from reflections.models import QuarterlyReflection


class Command(BaseCommand):
    help = 'Seeds the database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')

        # Create a test user if not exists
        user, created = User.objects.get_or_create(
            username='demo',
            defaults={
                'email': 'demo@strategichorizon.com',
                'first_name': 'Demo',
                'last_name': 'User'
            }
        )
        if created:
            user.set_password('demo123')
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {user.username}'))
        else:
            self.stdout.write(self.style.WARNING(f'User already exists: {user.username}'))

        # Seed Vision
        if not Vision.objects.filter(user=user).exists():
            vision = Vision.objects.create(
                user=user,
                year=2026,
                north_star="Become a recognized leader in strategic planning and execution",
                yearly_theme="Year of Scale and Growth"
            )
            self.stdout.write(self.style.SUCCESS(f'Created vision: {vision}'))

        # Seed Goals
        if not Goal.objects.filter(user=user).exists():
            goals_data = [
                {
                    'title': 'Launch New Product Line',
                    'description': 'Develop and launch 3 new products in Q1-Q2',
                    'status': 'in_progress',
                    'target_date': '2026-06-30'
                },
                {
                    'title': 'Expand Team',
                    'description': 'Hire 10 new team members across departments',
                    'status': 'pending',
                    'target_date': '2026-12-31'
                },
                {
                    'title': 'Increase Revenue',
                    'description': 'Achieve 50% revenue growth year-over-year',
                    'status': 'in_progress',
                    'target_date': '2026-12-31'
                }
            ]
            for data in goals_data:
                goal = Goal.objects.create(user=user, vision=vision, **data)
                self.stdout.write(self.style.SUCCESS(f'Created goal: {goal.title}'))

        # Seed KPIs
        goals = Goal.objects.filter(user=user)
        if goals.exists() and not KPI.objects.filter(user=user).exists():
            kpis_data = [
                {
                    'goal': goals[0],
                    'name': 'Product Launch Completion',
                    'description': 'Number of products launched',
                    'target_value': 3,
                    'actual_value': 1,
                    'unit': 'products'
                },
                {
                    'goal': goals[2],
                    'name': 'Monthly Revenue',
                    'description': 'Monthly recurring revenue',
                    'target_value': 150000,
                    'actual_value': 100000,
                    'unit': 'USD'
                }
            ]
            for data in kpis_data:
                kpi = KPI.objects.create(user=user, **data)
                self.stdout.write(self.style.SUCCESS(f'Created KPI: {kpi.name}'))

        # Seed Non-Negotiables
        if not NonNegotiable.objects.filter(user=user).exists():
            nn_data = [
                {
                    'title': 'Morning Routine',
                    'description': '30 minutes of exercise and meditation every morning',
                    'frequency': 'daily'
                },
                {
                    'title': 'Weekly Review',
                    'description': 'Sunday evening planning and review session',
                    'frequency': 'weekly'
                },
                {
                    'title': 'Family Time',
                    'description': 'No work after 6 PM on weekdays',
                    'frequency': 'daily'
                }
            ]
            for data in nn_data:
                nn = NonNegotiable.objects.create(user=user, **data)
                self.stdout.write(self.style.SUCCESS(f'Created non-negotiable: {nn.title}'))

        # Seed Systems
        if not System.objects.filter(user=user).exists():
            systems_data = [
                {
                    'name': 'Content Creation System',
                    'description': 'Weekly blog post and social media content',
                    'frequency': 'Weekly'
                },
                {
                    'name': 'Client Check-in System',
                    'description': 'Bi-weekly calls with all active clients',
                    'frequency': 'Bi-weekly'
                }
            ]
            for data in systems_data:
                system = System.objects.create(user=user, **data)
                self.stdout.write(self.style.SUCCESS(f'Created system: {system.name}'))

        # Seed People
        if not Person.objects.filter(user=user).exists():
            people_data = [
                {
                    'name': 'Sarah Johnson',
                    'role': 'mentor',
                    'role_description': 'Business strategy mentor',
                    'contact_info': 'sarah.j@email.com',
                    'notes': 'Monthly mentorship calls'
                },
                {
                    'name': 'Mike Chen',
                    'role': 'partner',
                    'role_description': 'Co-founder and CTO',
                    'contact_info': 'mike@company.com',
                    'notes': 'Technical leadership partner'
                }
            ]
            for data in people_data:
                person = Person.objects.create(user=user, **data)
                self.stdout.write(self.style.SUCCESS(f'Created person: {person.name}'))

        # Seed Executions
        if not Execution.objects.filter(user=user).exists():
            executions_data = [
                {
                    'title': 'Product Research & Development',
                    'description': 'Complete market research and initial development',
                    'month': 1,
                    'year': 2026,
                    'status': 'completed'
                },
                {
                    'title': 'Beta Testing Launch',
                    'description': 'Launch beta program with 50 users',
                    'month': 3,
                    'year': 2026,
                    'status': 'in_progress'
                },
                {
                    'title': 'Marketing Campaign',
                    'description': 'Launch comprehensive marketing campaign',
                    'month': 6,
                    'year': 2026,
                    'status': 'planned'
                }
            ]
            for data in executions_data:
                execution = Execution.objects.create(user=user, goal=goals[0] if goals.exists() else None, **data)
                self.stdout.write(self.style.SUCCESS(f'Created execution: {execution.title}'))

        # Seed Obstacles
        if not Obstacle.objects.filter(user=user).exists():
            obstacles_data = [
                {
                    'title': 'Market Competition',
                    'description': 'High competition in the target market',
                    'severity': 'high',
                    'mitigation': 'Focus on unique value proposition and superior customer service'
                },
                {
                    'title': 'Resource Constraints',
                    'description': 'Limited budget for hiring and marketing',
                    'severity': 'medium',
                    'mitigation': 'Prioritize key hires and use cost-effective marketing channels'
                }
            ]
            for data in obstacles_data:
                obstacle = Obstacle.objects.create(user=user, goal=goals[0] if goals.exists() else None, **data)
                self.stdout.write(self.style.SUCCESS(f'Created obstacle: {obstacle.title}'))

        # Seed Quarterly Reflections
        if not QuarterlyReflection.objects.filter(user=user).exists():
            reflection = QuarterlyReflection.objects.create(
                user=user,
                quarter=1,
                year=2026,
                wins="Successfully launched initial product prototype and secured 3 early customers",
                challenges="Faced delays in hiring key team members",
                lessons_learned="Need to start recruitment process earlier and build stronger talent pipeline",
                adjustments="Prioritize HR processes and consider contracting before full-time hires"
            )
            self.stdout.write(self.style.SUCCESS(f'Created reflection: Q1 2026'))

        self.stdout.write(self.style.SUCCESS('Database seeding completed successfully!'))
