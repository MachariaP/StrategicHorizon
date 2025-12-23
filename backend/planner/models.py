from django.db import models
from django.contrib.auth.models import User


class Vision(models.Model):
    """Yearly North Star statement and Theme"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='visions')
    year = models.IntegerField()
    north_star = models.TextField(help_text="Vision statement for the year")
    yearly_theme = models.CharField(max_length=200, help_text="e.g., 'Year of Scale'")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-year']
        unique_together = ['user', 'year']

    def __str__(self):
        return f"{self.user.username} - {self.year}: {self.yearly_theme}"


class Goal(models.Model):
    """Specific, measurable milestones with status tracking"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    vision = models.ForeignKey(Vision, on_delete=models.CASCADE, related_name='goals', null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    target_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['target_date', '-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.title}"


class KPI(models.Model):
    """Key Performance Indicators linked to Goals"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='kpis')
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='kpis')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    target_value = models.DecimalField(max_digits=10, decimal_places=2)
    actual_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    unit = models.CharField(max_length=50, help_text="e.g., 'USD', '%', 'units'")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['goal', 'name']
        verbose_name = 'KPI'
        verbose_name_plural = 'KPIs'

    def __str__(self):
        return f"{self.name} - Target: {self.target_value} {self.unit}"

    @property
    def progress_percentage(self):
        """Calculate progress as percentage"""
        if self.target_value > 0:
            return (float(self.actual_value) / float(self.target_value)) * 100
        return 0


class NonNegotiable(models.Model):
    """Daily/weekly boundaries or rules"""
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='non_negotiables')
    title = models.CharField(max_length=255)
    description = models.TextField()
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default='daily')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['frequency', 'title']

    def __str__(self):
        return f"{self.user.username} - {self.title} ({self.frequency})"


class System(models.Model):
    """Recurring processes/habits"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='systems')
    name = models.CharField(max_length=255)
    description = models.TextField(help_text="e.g., 'Sunday Weekly Review'")
    frequency = models.CharField(max_length=100, help_text="How often this system is executed")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.user.username} - {self.name}"


class Person(models.Model):
    """Directory of mentors, partners, or supporters"""
    ROLE_CHOICES = [
        ('mentor', 'Mentor'),
        ('partner', 'Partner'),
        ('supporter', 'Supporter'),
        ('advisor', 'Advisor'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='people')
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    role_description = models.TextField(help_text="Specific role/contribution")
    contact_info = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'People'

    def __str__(self):
        return f"{self.name} - {self.role}"


class Execution(models.Model):
    """Monthly roadmap (Jan-Dec) with specific tasks"""
    MONTH_CHOICES = [
        (1, 'January'),
        (2, 'February'),
        (3, 'March'),
        (4, 'April'),
        (5, 'May'),
        (6, 'June'),
        (7, 'July'),
        (8, 'August'),
        (9, 'September'),
        (10, 'October'),
        (11, 'November'),
        (12, 'December'),
    ]

    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('deferred', 'Deferred'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='executions')
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='executions', null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    month = models.IntegerField(choices=MONTH_CHOICES)
    year = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['year', 'month']

    def __str__(self):
        return f"{self.user.username} - {self.get_month_display()} {self.year}: {self.title}"


class Obstacle(models.Model):
    """Pre-Mortem: Risks and their solutions"""
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='obstacles')
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='obstacles', null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField(help_text="Describe the potential obstacle/risk")
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='medium')
    mitigation = models.TextField(help_text="Strategy to mitigate or resolve this obstacle")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-severity', 'title']

    def __str__(self):
        return f"{self.user.username} - {self.title} ({self.severity})"


class QuarterlyReflection(models.Model):
    """Review module for Q1-Q4 to allow for plan pivots"""
    QUARTER_CHOICES = [
        (1, 'Q1'),
        (2, 'Q2'),
        (3, 'Q3'),
        (4, 'Q4'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reflections')
    quarter = models.IntegerField(choices=QUARTER_CHOICES)
    year = models.IntegerField()
    wins = models.TextField(help_text="What went well this quarter?")
    challenges = models.TextField(help_text="What didn't go as planned?")
    lessons_learned = models.TextField(help_text="Key takeaways and insights")
    adjustments = models.TextField(help_text="Plan adjustments for next quarter")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-year', '-quarter']
        unique_together = ['user', 'quarter', 'year']

    def __str__(self):
        return f"{self.user.username} - {self.get_quarter_display()} {self.year}"

