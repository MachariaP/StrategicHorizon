"""
Custom pagination classes for Strategic Horizon API.
"""
from rest_framework.pagination import LimitOffsetPagination
from typing import Dict, Any


class StandardLimitOffsetPagination(LimitOffsetPagination):
    """
    Standard pagination using limit/offset pattern.
    
    Allows clients to specify:
    - limit: Number of results per page (default 20, max 100)
    - offset: Starting position in the result set
    """
    
    default_limit = 20
    max_limit = 100
    limit_query_param = 'limit'
    offset_query_param = 'offset'
