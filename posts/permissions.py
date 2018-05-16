from rest_framework import permissions


class IsAuthorOfPost(permissions.BasePermission):
    def has_object_permission(self, request, view, post):
        if request.user:
            return post.author == request.user
        return False


class IsAuthorOfComment(permissions.BasePermission):
    def has_object_permission(self, request, view, comment):
        if request.user:
            return comment.author == request.user
        return False