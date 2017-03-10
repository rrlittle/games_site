from models import Lobby, Player, Game, Hex
from channels import Channel
import json
from channels.auth import channel_session_user_from_http, channel_session_user
from django.core.exceptions import ObjectDoesNotExist, ValidationError


def send_single(reply_channel, msg):
	# print 'sending single', msg
	reply_channel.send({
		'text': json.dumps(msg)
		})

@channel_session_user_from_http  # load the username into the message
def ws_connect(message, gameid):
	''' just accept the connection. all the stuff will happen via messages
	'''
	print 'new connection at game', gameid
	message.reply_channel.send({'accept':True})

@channel_session_user
def ws_disconnect(message, gameid):
	''' remove the reply channel from the lobby.ws_group
		so they won''t get the messages when we broadcast
	'''
	playerid = None
	if 'playerid' in message.channel_session:
		playerid = message.channel_session['playerid']
	else:
		playerid = 'no player id'

	print 'in game', playerid, 'disconnected from', gameid
	try:
		game = Game.objects.get(pk=gameid)
		lobby = game.lobby
		lobby.ws_group.discard(message.reply_channel)
	except ObjectDoesNotExist as e: 
		print e
			
@channel_session_user
def ws_receive(message, gameid):
	''' parse the message and send it onto the channel handlers based on the 
		command field
	'''
	payload = json.loads(message['text'])
	print 'game', gameid, 'received message', payload
	payload['reply_channel'] = message['reply_channel']
	payload['gameid'] = gameid
	Channel('catan.game.receive').send(payload)

@channel_session_user
def join_game(message):
	'''after a player connects they send a join command which is routed here.
		this checks that the player object exists by using the message.user.
		if it you are part of the lobby. then send you the game status
		
		
	'''
	reply_channel = message.reply_channel
	try:
		userid = message.user.id
		game = Game.objects.get(pk=message['gameid'])
		lobby = game.lobby
		print userid, 'trying to join game', game
		# if they are not in the lobby
		if not lobby.player_set.filter(userid=userid).exists():
			print 'user', userid, 'not in the game', game
			return
		lobby.ws_group.add(reply_channel)
		# else they are in the lobby so send them the game status
		game.send_status()
	except ObjectDoesNotExist as e:
		send_single(reply_channel, {'err': str(e)})