# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('boards', '0009_inviteduser_board'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='board',
            name='description',
        ),
    ]
