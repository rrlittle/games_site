from channels import Group
import json

def add_player(message, lobby):
	print 'new connection! to lobby %s'%lobby
	# accept the reply channel request
	message.reply_channel.send({"accept": True})
	# add this connection to the blobio group
	Group("blobio%s"%lobby).add(message.reply_channel)  


def recive_mouse(message, lobby):
	 message.reply_channel.send({
        "text": message.content['text'],
    })

def disconnect(message, lobby):
	# remove this connection from the group
	Group('blobio').discard(message.reply_channel)
