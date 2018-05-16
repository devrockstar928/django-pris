# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('boards', '0002_auto_20150323_0436'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('organizations', '0002_organizations_users'),
    ]

    operations = [
        migrations.CreateModel(
            name='Organization',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('boards', models.ManyToManyField(related_name=b'organization_boards', null=True, to='boards.Board', blank=True)),
                ('users', models.ManyToManyField(related_name=b'organization_users', null=True, to=settings.AUTH_USER_MODEL, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='organizations',
            name='boards',
        ),
        migrations.RemoveField(
            model_name='organizations',
            name='users',
        ),
        migrations.DeleteModel(
            name='Organizations',
        ),
    ]
