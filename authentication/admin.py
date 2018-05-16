from django.contrib import admin

from .models import Account
from organizations.models import Organization


from django import forms
from django.contrib import admin


class AccountForm(forms.ModelForm):
    organization = forms.ModelMultipleChoiceField(Organization.objects.all(), required=False,)

    def __init__(self, *args, **kwargs):
        super(AccountForm, self).__init__(*args, **kwargs)
        if self.instance.pk:
            self.initial['organization'] = self.instance.organization.values_list('pk', flat=True)

    def save(self, *args, **kwargs):
        instance = super(AccountForm, self).save(*args, **kwargs)
        if instance.pk:
            for org in instance.organization.all():
                if org not in self.cleaned_data['organization']:
                    instance.organization.remove(org)
            for org in self.cleaned_data['organization']:
                if org not in instance.organization.all():
                    instance.organization.add(org)
        return instance


class AccountAdmin(admin.ModelAdmin):

    form = AccountForm

    fieldsets = ((None, {'fields': ('email', 'username',
                                    'first_name', 'last_name', 'title',
                                    'is_admin', 'is_staff', 'is_active',
                                    'password', 'organization', 'gravatar_url', 'has_gravatar')}),)

# Register your models here.
admin.site.register(Account, AccountAdmin)