from __future__ import unicode_literals

from django.db import models
from channels import Group

class Game(models.Model):
	width = models.PositiveIntegerField(default=500)
	height = models.PositiveIntegerField(default=500)
	@property
	def ws_group(self):
		return Group('blobio-game-%s'%self.id)
	
	def send_game_state(self):
		''' broadcast the game state to the group'''
		Blob.objects.filter(game=self)


class Blob(models.Model):
	x = models.PositiveIntegerField()
	y = models.PositiveIntegerField()
	r = models.PositiveIntegerField()
	game = models.ForeignKey(Game)
	
