from django.contrib import admin
from django import forms

from .models import Board, InvitedUser


class BoardsAdminForm(forms.ModelForm):

    class Meta:
        model = Board
        fields = '__all__'


class BoardsAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    form = BoardsAdminForm


class InvitedUserAdminForm(forms.ModelForm):

    class Meta:
        model = InvitedUser
        fields = '__all__'


class InvitedUserAdmin(admin.ModelAdmin):
    list_display = ('board', 'email', 'salt', 'created_at')
    form = InvitedUserAdminForm


# Register your models here.
admin.site.register(Board, BoardsAdmin)
admin.site.register(InvitedUser, InvitedUserAdmin)
