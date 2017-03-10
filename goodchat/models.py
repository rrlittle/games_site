from __future__ import unicode_literals

from django.db import models
import json
from channels import Group

# Create your models here.
class Room(models.Model):
	# room title
	title = models.CharField(max_length=255)

	def __str__(self):
		return self.title

	# make this function get called automatically on Room().websocket_group
	# by making it a property
	@property   
	def websocket_group(self):  
		return Group('goodchat-room-%s'%self.id)
	
	# sends a message to the whole room
	def send_message(self, message, usr):
		final_msg = {
			'room': str(self.id),
			'message': message,
			'username':usr.username,
		}
		self.websocket_group.send({
			'text':json.dumps(final_msg)
			})