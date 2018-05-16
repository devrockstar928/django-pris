# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('boards', '0002_auto_20150323_0436'),
        ('posts', '0006_postlike'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='board',
            field=models.ManyToManyField(related_name=b'post_board', null=True, to='boards.Board', blank=True),
            preserve_default=True,
        ),
    ]
