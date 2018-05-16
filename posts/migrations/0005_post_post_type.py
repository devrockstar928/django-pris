# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0004_auto_20150306_0159'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='post_type',
            field=models.TextField(null=True, blank=True),
            preserve_default=True,
        ),
    ]
