# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('boards', '0004_auto_20150330_0552'),
    ]

    operations = [
        migrations.AlterField(
            model_name='board',
            name='title',
            field=models.TextField(),
        ),
    ]
