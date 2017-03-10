from models import Lobby, Player, Game
from channels import Channel
import json
from channels.auth import channel_session_user_from_http, channel_session_user
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.core.urlresolvers import reverse
from views import game

def send_single(reply_channel, msg):
	# print 'sending single', msg
	reply_channel.send({
		'text': json.dumps(msg)
		})

@channel_session_user_from_http  # load the username into the message
def ws_connect(message, lobbyid):
	''' just accept the connection. all the stuff will happen via messages
	'''
	print 'new connection at', lobbyid
	message.reply_channel.send({'accept':True})

@channel_session_user
def ws_disconnect(message, lobbyid):
	''' remove socket from the group. so they won't 
		get messages during broadcasts anymore
	'''
	playerid = None
	if 'playerid' in message.channel_session:
		playerid = message.channel_session['playerid']
	else:
		playerid = 'no player id'
	print playerid, 'disconnected from', lobbyid
	try:
		lobby = Lobby.objects.get(pk=lobbyid)
		lobby.ws_group.discard(message.reply_channel)
	except ObjectDoesNotExist as e: 
		print e
			
@channel_session_user
def ws_receive(message, lobbyid):
	''' parse the message and send it onto the channel handlers based on the 
		command field
	'''
	payload = json.loads(message['text'])
	print lobbyid, 'received message', payload
	payload['reply_channel'] = message['reply_channel']
	payload['lobbyid'] = lobbyid
	Channel('catan.lobby.receive').send(payload)



@channel_session_user
def new_player(message):
	''' after a player connects. they send a join command message. 
		which is routed here.
		this creates a new player object and broadcasts a new_player command
		to the whole lobby.
		it then sends an add_player command back to the client for all the 
		players in the lobby 
	'''
	lobbyid = message['lobbyid']
	userid = message.user.id
	print 'new player at', lobbyid, message.keys()
	reply_channel = message.reply_channel

	try:
		# get the lobby they are joining
		lobby = Lobby.objects.get(pk=lobbyid)
		# add this client to the lobby
		lobby.ws_group.add(reply_channel) 
	
		player = None  # set player next 
		# if you are not already in the lobby
		if not lobby.player_set.filter(userid=userid).exists():
			# create a new player
			player = Player.objects.create(
				name=message.user.username.title(), 
				lobby=lobby,
				userid=userid)
		else:  # if you are already in the lobby
			player = Player.objects.get(lobby=lobby, userid=userid)

		# save the player id for use in disconnecting
		print 'setting channel playerid to', player.id
		message.channel_session['playerid'] = player.id

		# tell the player their id
		send_single(reply_channel, {'i_am':player.id})
		
		# tell all clients the new players status
		lobby.broadcast_players() 
				

	except ObjectDoesNotExist as e: # if lobby does not exist
		send_single(reply_channel, {'err': str(e)})

		
@channel_session_user
def remove_player(message):
	lobbyid = message['lobbyid']
	reply_channel = message['reply_channel']
	print 'remove player from', lobbyid, message.keys()
	
	# remove the player channel from the group
	try:
		if 'playerid' in message:
			lobby = Lobby.objects.get(pk=lobbyid)
			p = lobby.player_set.get(pk=message['playerid'])
			p.delete()
			lobby.broadcast_players()
			lobby.broadcast({
				'notify':'removed %s : %s'%(message.user.username, message['playerid'])
			})
	except ObjectDoesNotExist as e: # either lobby or player do not exist
		pass # websocket already closed and no group associated

@channel_session_user
def set_color(message):
	playerid = message.channel_session['playerid']
	lobbyid = message['lobbyid']
	reply_channel = message.reply_channel

	print 'setting player',playerid, ' to color ', message['color']
	try:
		player = Player.objects.get(pk=playerid)
		player.color=message['color']
		player.full_clean()
		player.save()
		lobby = Lobby.objects.get(pk=lobbyid)
		lobby.broadcast_players()

	except (ObjectDoesNotExist, ValidationError) as e:
		send_single(reply_channel, {'err': str(e)})


@channel_session_user
def begin_game(message):
	''' this is triggered when someone in the lobby hits the begin button.
		if they send a payload with command:begin
		this makes sure you are a valid player in the lobby
		and sends out a begin_game message with the url of the game
		so the client can redirect
	'''
	userid = message.user.id
	lobbyid = message['lobbyid']
	reply_channel = message.reply_channel
	print userid, 'trying to begin the game for', lobbyid
	try:
		# get the lobby
		lobby = Lobby.objects.get(pk=lobbyid)
		# if player is not in lobby -> fail
		if not lobby.player_set.filter(userid=userid).exists(): 
			send_single(reply_channel, {'err': 'you are not in lobby'})
			return
		# else player is in lobby
		# create a new game in the lobby
		game = Game.objects.create(
			lobby=lobby,
			version=lobby.get_majority_vote()
			)
		game.full_clean()
		game.populate()
		lobby.status = 'playing'
		lobby.full_clean()
		lobby.save()
		payload = {
			'begin_game': reverse('catan:game', kwargs={'gameid':game.id})
		}
		lobby.broadcast(payload)

			
	except ObjectDoesNotExist as e:
		send_single(reply_channel, {'err': str(e)})


@channel_session_user
def set_vote(message):
	''' this sets a player vote field if it's a valid version. 
		if it can't be validated or the vote field doesn't exist.
		send an error mesage back
	'''
	userid = message.user.id
	lobbyid = message['lobbyid']
	reply_channel = message.reply_channel
	print 'processing vote for %s in lobby %s'%(userid, lobbyid)

	try:
		# get the lobby
		lobby = Lobby.objects.get(pk=lobbyid)

		# if you are not in the lobby
		if not lobby.player_set.filter(userid=userid).exists():
			send_single(reply_channel, {'err': 'you are not in lobby'})
			return

		player = lobby.player_set.get(userid=userid)
		# if you voted
		if 'vote' in message:
			vote = message['vote']
			player.vote = vote
			player.full_clean()
			player.save()
		# else don't set the vote
	except (ObjectDoesNotExist, ValidationError) as e:
		send_single(reply_channel, {'err': str(e)})


