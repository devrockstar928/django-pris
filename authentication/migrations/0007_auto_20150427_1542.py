# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0006_remove_account_organization'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='gravatar_url',
            field=models.TextField(default=b'', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='account',
            name='has_gravatar',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
