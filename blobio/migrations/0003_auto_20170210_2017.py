# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2017-02-10 20:17
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('blobio', '0002_auto_20170203_0716'),
    ]

    operations = [
        migrations.CreateModel(
            name='Blob',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('x', models.PositiveIntegerField()),
                ('y', models.PositiveIntegerField()),
                ('r', models.PositiveIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('width', models.PositiveIntegerField(default=500)),
                ('height', models.PositiveIntegerField(default=500)),
            ],
        ),
        migrations.AddField(
            model_name='blob',
            name='game',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='blobio.Game'),
        ),
    ]