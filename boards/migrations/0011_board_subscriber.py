# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('boards', '0010_remove_board_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='board',
            name='subscriber',
            field=models.ManyToManyField(related_name=b'subscriber', null=True, to=settings.AUTH_USER_MODEL, blank=True),
            preserve_default=True,
        ),
    ]
