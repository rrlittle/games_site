# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-03-06 03:32
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('catan', '0006_auto_20170222_1809'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cost',
            name='version',
        ),
    ]
