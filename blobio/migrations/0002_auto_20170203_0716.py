# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2017-02-03 07:16
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blobio', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='blob',
            name='game',
        ),
        migrations.DeleteModel(
            name='Blob',
        ),
        migrations.DeleteModel(
            name='Game',
        ),
    ]
