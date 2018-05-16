from django.contrib import admin
from ckeditor.widgets import CKEditorWidget
from django import forms

from .models import Post, Comment, PostLike, PostTag, Tag


class PostAdminForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorWidget())

    class Meta:
        model = Post
        fields = '__all__'


class PostAdmin(admin.ModelAdmin):
    list_display = ('author', 'image', 'description', 'username', 'report_link', 'post_type', 'created_at')
    form = PostAdminForm


class PostTagAdminForm(forms.ModelForm):

    class Meta:
        model = PostTag
        fields = '__all__'


class PostTagAdmin(admin.ModelAdmin):
    list_display = ('post', 'tag')
    form = PostTagAdminForm


# Register your models here.
admin.site.register(Post, PostAdmin)
admin.site.register(Comment, admin.ModelAdmin)
admin.site.register(PostLike, admin.ModelAdmin)
admin.site.register(PostTag, PostTagAdmin)
admin.site.register(Tag, admin.ModelAdmin)