"""
Custom permission classes for Strategic Horizon.
"""
from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.views import View
from typing import Any


class IsOwner(permissions.BasePermission):
    """
    Custom permission to ensure users can only access their own data.
    
    Checks if the object being accessed has a 'user' field that matches
    the requesting user.
    """
    
    message = "You do not have permission to access this resource."
    
    def has_object_permission(
        self, 
        request: Request, 
        view: View, 
        obj: Any
    ) -> bool:
        """
        Check if the user owns the object.
        
        Args:
            request: The incoming request
            view: The view being accessed
            obj: The object being accessed
            
        Returns:
            True if the user owns the object, False otherwise
        """
        # Read permissions are allowed for authenticated users,
        # but we still check ownership
        if not hasattr(obj, 'user'):
            # If object doesn't have a user field, deny access
            return False
        
        # Check if the object's user matches the requesting user
        return obj.user == request.user
