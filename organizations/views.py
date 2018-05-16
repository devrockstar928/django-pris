from rest_framework import viewsets, permissions
from rest_framework.response import Response

from organizations.models import Organization
from organizations.serializers import OrganizationSerializer
from authentication.utils import token_required
from authentication.permissions import IsAccountOwner


class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.order_by('-created_at')
    serializer_class = OrganizationSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.IsAuthenticated(), IsAccountOwner(), )

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwner(),)


class AccountOrganizationViewSet(viewsets.ViewSet):
    queryset = Organization.objects.order_by('-created_at')
    serializer_class = OrganizationSerializer

    def list(self, request, account_username=None):
        queryset = self.queryset.filter(users__username=account_username)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)