from channels import Channel
from channels.sessions import channel_session
from channels.auth import channel_session_user, channel_session_user_from_http
from models import Room, Message
import json

@channel_session_user_from_http  # available on ws_connect handlers
def ws_connect(message):
	''' called upon websocket.connect signal being raised to the correct path
		defined in base_site routing.py

		all this does is accept the connection. to allow the client to 
		send future requests to the server. 

		we accept all traffic going to the correct url. 
		if overloading the server, you can use some sort of auth to deny 
		some connections
	'''
	print 'websocket connect'
	# prepare to save rooms they belong to
	message.channel_session['rooms'] = [] 
	
	# accept the connection
	message.reply_channel.send({'accept':True}) 


@channel_session
def ws_disconnect(message):
	''' called upon websocket.disconnect signal being raised on the correct path
		defined in base_site routing.py

		this removes the message_reply channel from all the rooms 
		they are currently in
	'''
	print 'websocket disconnect'
	for room_id in message.channel_session['rooms']:
		try:
			room = Room.objects.get(title=room_id)
			# remove channel from this rooms group
			room.ws_group.discard(message.reply_channel)
		except Room.DoesNotExist:
			pass # no group to remove them from


@channel_session_user
def ws_receive(message):
	''' called upon websocket.receive signal being raised on the correct path
		defined in base_site routing.py

		parses the message and asserts it's in the correct format. 
		if it raises an error, an error will be sent back on the reply_channel
		else
		this passes the message onto the chat.receive Channel, which handles 
		it based on command. 
	'''
	print 'websocket receive'
	payload = json.loads(message['text']) # parse the text from the message

	# Channel requires the reply channel in this format
	payload['reply_channel'] = message['reply_channel'] 

	# assert it's in the correct format
	assert 'command' in payload, 'command field required in payload'
	assert 'room' in payload, 'room field required in payload'
	print 'passed asserts'
	print payload
	# load the payload onto the channel queue for processing
	Channel('chat.recieve').send(payload)
