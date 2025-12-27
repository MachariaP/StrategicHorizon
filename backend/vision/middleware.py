from django.utils import timezone
from datetime import timedelta
from django.core.cache import cache


class VisionPresenceMiddleware:
    """
    Tracks the last time the user interacted with their Vision.
    If they haven't interacted with the Vision model in 7 days,
    sends a flag in the metadata of every API response to trigger
    a "Clarity Reminder" on the frontend.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        self.reminder_threshold_days = 7
    
    def __call__(self, request):
        # Track vision interaction
        if request.user.is_authenticated:
            # Check if user is accessing any vision endpoints
            if request.path.startswith('/api/vision/'):
                # Update last interaction time
                cache_key = f'vision_last_interaction_{request.user.id}'
                cache.set(cache_key, timezone.now(), timeout=None)
        
        response = self.get_response(request)
        
        # Add vision presence metadata to response
        if request.user.is_authenticated and hasattr(response, 'data'):
            cache_key = f'vision_last_interaction_{request.user.id}'
            last_interaction = cache.get(cache_key)
            
            if last_interaction:
                days_since_interaction = (timezone.now() - last_interaction).days
                needs_reminder = days_since_interaction >= self.reminder_threshold_days
            else:
                needs_reminder = True
            
            # Add metadata to response
            if isinstance(response.data, dict):
                if '_metadata' not in response.data:
                    response.data['_metadata'] = {}
                response.data['_metadata']['vision_clarity_reminder'] = needs_reminder
                if needs_reminder:
                    response.data['_metadata']['reminder_message'] = (
                        "It's been a while since you reviewed your vision. "
                        "Take a moment to reconnect with your North Star."
                    )
        
        return response
