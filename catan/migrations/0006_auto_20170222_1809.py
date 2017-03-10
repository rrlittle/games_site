# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2017-02-22 18:09
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('catan', '0005_auto_20170222_0529'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='currentplayer',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='catan.Player'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='game',
            name='gamephase',
            field=models.CharField(choices=[(b'start', b'start'), (b'main', b'main'), (b'end', b'end')], default='start', max_length=20),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='game',
            name='turnphase',
            field=models.CharField(choices=[(b'roll', b'roll'), (b'main', b'main'), (b'score', b'score'), (b'wait', b'wait')], default='main', max_length=20),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='player',
            name='vote',
            field=models.CharField(blank=True, choices=[(b'default', b'default'), (b'default2', b'default2')], max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='version',
            name='version',
            field=models.CharField(choices=[(b'default', b'default'), (b'default2', b'default2')], default=b'default', max_length=20),
        ),
    ]