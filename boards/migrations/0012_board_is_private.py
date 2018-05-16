# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('boards', '0011_board_subscriber'),
    ]

    operations = [
        migrations.AddField(
            model_name='board',
            name='is_private',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
    ]
