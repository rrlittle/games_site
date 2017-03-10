''' chat channel handling. triggered when Channel(chat.receive).send is hit
	and filtered on the command field.

	the chat app supports 4 commands
	- create: which creates a new Room, or joins an existing one
	- join: joins an existing Room, or returns an error
	- send: which broadcasts a message to the whole room
	- leave: which removes you from that room

	all chan_msgs contain
	- reply_channel ->  a channel to a specific client
	- room -> the title of the room the command belongs to 
	- command -> the command

	the @channel_session_user decorator can be used to add a user attribute
	to the chan_msg if need be.
'''
from channels import Channel
from models import Message, Room
from channels.auth import channel_session_user
import json

def chat_create(chan_msg):
	''' if the room doesn't exist create it, then pass the msg onto chat_join
	'''
	print 'chat create'
	try:
		Room.objects.get(title = chan_msg['room'])
	except Room.DoesNotExist:
		Room.objects.create(title = chan_msg['room']).save()
	finally:
		chan_msg['command'] = 'join'
		# import ipdb; ipdb.set_trace()
		Channel('chat.recieve').send(chan_msg.content)


@channel_session_user
def chat_join(chan_msg):
	''' join an existing room. this both adds them to the group and updates the
		channel_session['rooms'] attribute to include the new room
	'''
	print 'chat join'
	print chan_msg['room']
	room = Room.objects.get(title=chan_msg['room'])
	room.ws_group.add(chan_msg.reply_channel)  
	# this is how you access the reply channel for a chan_msg

	# notify the chatroom
	username = chan_msg.user.username
	joinmsg = '%s joined the chatroom!'%username
	msg = Message.objects.create(
		room=room,
		message=joinmsg,
		user=username
	)
	msg.save()
	msg.send_to_group()

	# save the room you are joining to the session
	rooms = set(chan_msg.channel_session['rooms']).union([room.title])
	chan_msg.channel_session['rooms'] = list(rooms)

	# send the last 50 messages from this room back to newly joined user
	for msg in room.last_n_rev(50):
		msg.send_single(chan_msg.reply_channel)


@channel_session_user
def chat_send(chan_msg):
	print 'chat send'
	room = Room.objects.get(title=chan_msg['room'])
	msg = Message.objects.create(
		room=room,
		message=chan_msg['message'],
		user=chan_msg.user.username
	)
	msg.save()
	msg.send_to_group()


@channel_session_user
def chat_leave(chan_msg):
	print 'chat leave'
	room = Room.objects.get(title=chan_msg['room'])

	# send a message to the room that user left
	username = chan_msg.user.username
	joinmsg = '%s left the chatroom!'%username
	msg = Message.objects.create(
		room=room,
		message=joinmsg,
		user=username
	)
	msg.save()
	msg.send_to_group()

	# remove this room from the channel_session
	rooms = set(chan_msg.channel_session['rooms']).difference([room.id]) 
	chan_msg.channel_session['rooms'] = list(rooms)

	# send a message back to prompt closing the room
	chan_msg.reply_channel.send({
		'text': json.dumps({
			'leave':room.title
			})
		})

	# remove the reply_channel from the group
	room.ws_group.discard(chan_msg.reply_channel)


