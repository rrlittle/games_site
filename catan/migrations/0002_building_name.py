# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2017-02-21 06:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catan', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='building',
            name='name',
            field=models.CharField(default='settlement', max_length=20),
            preserve_default=False,
        ),
    ]
