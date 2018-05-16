# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('boards', '0007_inviteduser'),
    ]

    operations = [
        migrations.AddField(
            model_name='inviteduser',
            name='created_at',
            field=models.DateTimeField(default=datetime.date(2015, 3, 31), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='inviteduser',
            name='updated_at',
            field=models.DateTimeField(default=datetime.date(2015, 3, 31), auto_now=True),
            preserve_default=False,
        ),
    ]
