from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponseForbidden
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout, authenticate
from models import Lobby, Player, Game, VERSION_OPTIONS, Building
# Create your views here.
def index(request):
	yourgames = []

	for p in Player.objects.filter(userid=request.user.id):
		if p.lobby.status == 'playing': yourgames.append(p.lobby.game)
	yourlobbies = []
	for p in Player.objects.filter(userid=request.user.id):
		if p.lobby.status == 'open': yourlobbies.append(p.lobby)

	lobbies = Lobby.objects.filter(status='open').order_by('created')
	
	otherlobbies = [l for l in lobbies if l not in yourlobbies]
	context = {
		'your_games': yourgames,
		'your_lobbies': yourlobbies, 
		'open_lobbies': otherlobbies,
	}
	print context
	return render(request, 'catan/index.html', context)

@login_required(login_url='/catan/login')
def lobby(request, lobbyid):
	lobby = get_object_or_404(Lobby, pk=lobbyid)

	if (lobby.player_set.all().count() >= 4
		and not lobby.player_set.filter(userid=request.user.id).exists()):
		return HttpResponseForbidden('Lobby full!')
	context = {
		'lobby':lobby,
		'versions':[v[1] for v in VERSION_OPTIONS]
	}
	return render(request, 'catan/lobby/lobby.html', context)

@login_required(login_url='/catan/login')
def newlobby(request):
	newlobby = Lobby.objects.create(status='open')
	return redirect('catan:lobby', lobbyid=newlobby.id)

@login_required(login_url='/catan/login')
def game(request, gameid):
	game = get_object_or_404(Game, pk=gameid)
	lobby = game.lobby
	# if user not in this lobby deny permission
	if not lobby.player_set.filter(userid=request.user.id).exists():
		return HttpResponseForbidden('You are not part of this game')

	player = get_object_or_404(Player, lobby=lobby, userid=request.user.id)
	buildings = Building.objects.filter(versions=game.version)
	
	context = {
		'game': game,
		'lobby': lobby,
		'player': player,
		'currentplayer': game.currentplayer,
		'buildings':[b.as_dict() for b in buildings]
	}
	return render(request, 'catan/game/game.html', context)

def login_view(request):
	''' this is the lannding page for if you are not logged in to the catan
		system. 
		it also accepts POST requests to authenticate log in queries and 
		redirects you to the index if successful. 
		or to this page if unsuccessful. 
	'''

	username = request.POST['username']
	password = request.POST['password']
	user = authenticate(username=username, password=password)
	if user is not None:
		login(request, user)
		# redirect to index
		return redirect('catan:index')
	else:
		return render(request, 'catan/index.html', 
			{'error':'password and username did not match'})