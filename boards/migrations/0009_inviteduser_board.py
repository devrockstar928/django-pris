# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('boards', '0008_auto_20150331_1525'),
    ]

    operations = [
        migrations.AddField(
            model_name='inviteduser',
            name='board',
            field=models.ForeignKey(blank=True, to='boards.Board', null=True),
            preserve_default=True,
        ),
    ]
