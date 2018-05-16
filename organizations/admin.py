from django.contrib import admin
from django import forms

from .models import Organization


class OrganizationAdminForm(forms.ModelForm):

    class Meta:
        model = Organization
        fields = '__all__'


class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    form = OrganizationAdminForm


# Register your models here.
admin.site.register(Organization, OrganizationAdmin)
