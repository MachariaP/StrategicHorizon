"""
Custom pagination classes for Strategic Horizon API.
"""
from rest_framework.pagination import CursorPagination, PageNumberPagination


class ReflectionCursorPagination(CursorPagination):
    """
    Cursor-based pagination for Reflections (large sets).
    More efficient for large datasets as it doesn't count total items.
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
    ordering = '-created_at'  # Most recent first


class StandardResultsSetPagination(PageNumberPagination):
    """
    Offset-based pagination for Goals, KPIs, etc.
    Provides page numbers and total count.
    """
    page_size = 30
    page_size_query_param = 'page_size'
    max_page_size = 100
