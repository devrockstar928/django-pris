# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('boards', '0003_board_invited_users'),
    ]

    operations = [
        migrations.AlterField(
            model_name='board',
            name='title',
            field=models.TextField(unique=True),
        ),
    ]
