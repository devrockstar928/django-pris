# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('organizations', '0001_initial'),
        ('authentication', '0004_account_is_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='organization',
            field=models.ForeignKey(blank=True, to='organizations.Organizations', null=True),
            preserve_default=True,
        ),
    ]
