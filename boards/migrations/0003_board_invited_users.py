# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('boards', '0002_auto_20150323_0436'),
    ]

    operations = [
        migrations.AddField(
            model_name='board',
            name='invited_users',
            field=models.ManyToManyField(related_name=b'invited_users', null=True, to=settings.AUTH_USER_MODEL, blank=True),
            preserve_default=True,
        ),
    ]
