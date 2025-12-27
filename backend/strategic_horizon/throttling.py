"""
Custom throttle classes for Strategic Horizon API.
"""
from rest_framework.throttling import UserRateThrottle


class SensitiveEndpointThrottle(UserRateThrottle):
    """
    Throttle for sensitive endpoints like authentication.
    Rate: 5 requests per minute
    """
    scope = 'auth'
    rate = '5/minute'
