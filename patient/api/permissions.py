from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    message = "you are not the owner "
    def has_object_permission(self, request, view, obj):
        return self.user == obj.owner