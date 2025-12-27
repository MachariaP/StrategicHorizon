"""
Custom throttle classes for Strategic Horizon API.
"""
from rest_framework.throttling import UserRateThrottle
from django.conf import settings


class SensitiveEndpointThrottle(UserRateThrottle):
    """
    Throttle for sensitive endpoints like authentication.
    Rate can be configured via settings.REST_FRAMEWORK['DEFAULT_THROTTLE_RATES']['auth']
    Default: 5 requests per minute
    """
    scope = 'auth'
