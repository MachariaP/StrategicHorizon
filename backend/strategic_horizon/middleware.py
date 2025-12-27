"""
Custom middleware for Strategic Horizon application.
Provides Audit Log and Timezone functionality.
"""
import logging
import json
from django.utils import timezone
from django.utils.deprecation import MiddlewareMixin
from typing import Optional

logger = logging.getLogger('strategic_horizon.audit')


class AuditLogMiddleware(MiddlewareMixin):
    """
    Custom Audit Log Middleware that captures every POST/PATCH action
    to track strategic shifts and changes, with special emphasis on
    Vision and Goals endpoints.
    """
    
    def process_request(self, request):
        """Capture request start time."""
        request.audit_start_time = timezone.now()
        return None
    
    def process_response(self, request, response):
        """Log POST/PATCH actions for audit trail."""
        # Only log POST and PATCH requests
        if request.method not in ['POST', 'PATCH']:
            return response
        
        # Skip if not authenticated
        if not hasattr(request, 'user') or not request.user.is_authenticated:
            return response
        
        # Get response time
        if hasattr(request, 'audit_start_time'):
            response_time = (timezone.now() - request.audit_start_time).total_seconds()
        else:
            response_time = 0
        
        # Check if this is a strategic shift (Vision or Goals change)
        is_strategic_shift = self._is_strategic_shift(request.path)
        
        # Prepare audit log entry
        audit_data = {
            'timestamp': timezone.now().isoformat(),
            'user': request.user.username,
            'user_id': request.user.id,
            'method': request.method,
            'path': request.path,
            'status_code': response.status_code,
            'response_time': response_time,
            'ip_address': self._get_client_ip(request),
            'user_agent': request.META.get('HTTP_USER_AGENT', '')[:255],
            'is_strategic_shift': is_strategic_shift,
        }
        
        # Add special flag for strategic shifts
        if is_strategic_shift:
            audit_data['shift_type'] = self._get_shift_type(request.path)
        
        # Try to capture request body for POST/PATCH (but sanitize passwords)
        if request.method in ['POST', 'PATCH']:
            try:
                # Use request.data if available (set by DRF) to avoid RawPostDataException
                if hasattr(request, 'data') and request.data:
                    # request.data is already parsed by DRF
                    body = dict(request.data) if hasattr(request.data, 'items') else request.data
                    # Sanitize sensitive fields
                    body = self._sanitize_sensitive_data(body)
                    audit_data['request_body'] = body
            except (json.JSONDecodeError, UnicodeDecodeError, AttributeError):
                audit_data['request_body'] = 'Unable to parse'
            except Exception:
                # Silently handle any other exceptions (e.g., RawPostDataException)
                audit_data['request_body'] = 'Not available'
        
        # Log with special prefix for strategic shifts
        log_prefix = "STRATEGIC_SHIFT" if is_strategic_shift else "AUDIT"
        logger.info(f"{log_prefix}: {json.dumps(audit_data)}")
        
        return response
    
    def _is_strategic_shift(self, path: str) -> bool:
        """
        Determine if the request is a strategic shift (Vision or Goals change).
        
        Args:
            path: Request path
            
        Returns:
            True if path relates to Vision or Goals
        """
        strategic_paths = ['/api/vision/', '/api/goals/']
        return any(path.startswith(sp) for sp in strategic_paths)
    
    def _get_shift_type(self, path: str) -> str:
        """
        Get the type of strategic shift from the path.
        
        Args:
            path: Request path
            
        Returns:
            Type of shift (Vision or Goals)
        """
        if '/api/vision/' in path:
            return 'Vision'
        elif '/api/goals/' in path:
            return 'Goals'
        return 'Unknown'
    
    def _get_client_ip(self, request) -> str:
        """Extract client IP address from request."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip or 'unknown'
    
    def _sanitize_sensitive_data(self, data: dict) -> dict:
        """
        Sanitize sensitive fields from request body.
        Extends beyond passwords to include PII and confidential data.
        """
        sensitive_fields = [
            'password', 'password1', 'password2', 'old_password', 'new_password',
            'token', 'secret', 'api_key', 'access_token', 'refresh_token',
            'ssn', 'social_security', 'credit_card', 'card_number',
            'cvv', 'pin', 'secret_key', 'private_key'
        ]
        
        sanitized = data.copy()
        for field in sensitive_fields:
            if field in sanitized:
                sanitized[field] = '***REDACTED***'
        
        return sanitized


class TimezoneMiddleware(MiddlewareMixin):
    """
    Timezone Middleware that ensures all "Target Dates" are relative
    to the user's local time.
    
    Activates user's timezone if set in their profile or from request header.
    """
    
    def process_request(self, request):
        """Activate user's timezone for request processing."""
        user_timezone = self._get_user_timezone(request)
        
        if user_timezone:
            try:
                timezone.activate(user_timezone)
            except Exception as e:
                logger.warning(f"Failed to activate timezone {user_timezone}: {e}")
                timezone.deactivate()
        else:
            timezone.deactivate()
        
        return None
    
    def process_response(self, request, response):
        """Deactivate timezone after processing."""
        timezone.deactivate()
        return response
    
    def _get_user_timezone(self, request) -> Optional[str]:
        """
        Get user's timezone from various sources.
        Priority: User profile > Request header > Default
        """
        # Try to get from authenticated user's profile
        if hasattr(request, 'user') and request.user.is_authenticated:
            # Check if user has timezone in profile
            if hasattr(request.user, 'profile') and hasattr(request.user.profile, 'timezone'):
                return request.user.profile.timezone
        
        # Try to get from request header (sent by frontend)
        tz_header = request.META.get('HTTP_X_TIMEZONE')
        if tz_header:
            return tz_header
        
        # Default to None (will use Django's TIME_ZONE setting)
        return None
