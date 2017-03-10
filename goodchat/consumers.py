import json
from channels import Channel
from models import Room
from channels.sessions import channel_session
from channels.auth import channel_session_user_from_http, channel_session_user
from utils import catch_client_error, ClientError


# websocket handling


@channel_session_user_from_http # makes channel_session and user available
def ws_connect(message):
	message.reply_channel.send({'accept':True}) # accept the handshake
	# initialize the session
	message.channel_session['rooms'] = [] # belongs to these rooms
	#  empty on connect. they need ot send some join commands

# unpacks the json from the websocket and puts it into the room
# channel for processing
def ws_receive(message):
	payload = json.loads(message['text']) # parse the text from the message
	# add the reply channel to the  payload for future routing
	payload['reply_channel'] = message['reply_channel'] 
	# load the payload onto the channel queue for processing
	Channel('goodchat.receive').send(payload)

# removes channels from any groups
@channel_session_user
def ws_disconnect(message):
	# get the room ids this channel_session contains
	print message.channel_session.get('rooms', set())
	for room_id in message.channel_session.get('rooms', set()):
		try:
			room = Room.objects.get(pk=room_id)
			# remove channel from this rooms group
			room.websocket_group.discard(message.reply_channel)
		except Room.DoesNotExist:
			pass # no group to remove them from

# chat channel handling
# these are all triggered by ws_receive, which sends message payloads to 
# chat.receive, depending on the 'command' field of the payload, it will be
# routed to one of these 3

# I belive the message is slightly different for these. 
# they are dicts not Message objects

# join a chatroom
@channel_session_user # makes user and channel_session available
def chat_join(message):
	print 'chat join'
	room = Room.objects.get(pk=message['room']) # raises an error if doesn't exist
	room.websocket_group.add(message.reply_channel)
	joinmsg = '%s joined the room'% message.user.username
	room.send_message(joinmsg, message.user) # send message to whole room

	# update the rooms this channel belongs to
	rooms = set(message.channel_session['rooms']).union([room.id])
	message.channel_session['rooms'] = list(rooms)


	# send a message back to prompt them to open the room on the client
	message.reply_channel.send({
		'text':json.dumps({
			'join':str(room.id),
			'title': room.title,
			})
		})

# leave a chatroom
@channel_session_user
def chat_leave(message):
	print 'chat_leave'
	# reverse of join. remove them from everything
	room = Room.objects.get(pk=message['room'])

	leavemsg = '%s left the room'%message.user.username
	room.send_message(leavemsg, message.user)

	rooms = list(set(message.channel_session['rooms']).difference([room.id])) 
	message.channel_session['rooms'] = rooms

	# send a message back to close the room
	message.reply_channel.send({
		'text':json.dumps({
			'leave': str(room.id)
			})
		})
	room.websocket_group.discard(message.reply_channel)

# broadcast on a chatroom
@channel_session_user
def chat_send(message):
	print 'chatsend'
	# Find the room they're sending to
	room = Room.objects.get(pk=message['room'])
	room.send_message(message['message'], message.user)