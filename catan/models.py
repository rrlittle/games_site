# from __future__ import unicode_literals

from random import randrange
from django.db import models
from django.utils import timezone
from channels import Group
import json
from django.core.exceptions import ValidationError
from haikunator import Haikunator as h
def make_haiku(*args, **kwargs): return h.haikunate(0, ' ').title()

VERSION_OPTIONS = (
	('default', 'default'),
	('default2', 'default2'),
	)

RESOURCE_CHOICES = (
	('desert', 'desert'),
	('wood', 'wood'),
	('sheep', 'sheep'),
	('stone', 'stone'),
	('brick', 'brick'),
	('wheat', 'wheat')
	)

COLOR_OPTIONS = (
	('blue', 'blue'), 
	('white', 'white'), 
	('green', 'green'), 
	('red', 'red'), 
	('orange', 'orange')
	)

STATUS_OPTIONS = (
	('open', 'open'),
	('private', 'private'),
	('playing', 'playing')
	)

BUILDING_CHOICES = (
	('settlement','settlement'),
	('city','city'),
	('road','road'),
	)

RESOURCE_IMG_CHOICES = (
	('catan/img/wheat.png','wheat'), 
	('catan/img/brick.png','brick'), 
	('catan/img/stone.png','stone'), 
	('catan/img/wood.png','wood'), 
	('catan/img/sheep.png','sheep'), 
	)
	
GAME_PHASE_OPTIONS = (
	('start','start'),
	('main','main'),
	('end','end')
	)

TURN_PHASE_OPTIONS = (
	('roll','roll'),
	('main','main'),
	('score','score'),
	('wait','wait')
	)
# Create your models here.
class Lobby(models.Model):
	created = models.DateTimeField(default=timezone.now)
	status = models.CharField(max_length=20, 
		choices=STATUS_OPTIONS, 
		default='open')
	title = models.CharField(max_length=25, unique=True, default=make_haiku)
	@property
	def ws_group(self):
		return Group('catan-lobby-%s'%self.id)
			
	def broadcast_players(self):
		players = self.player_set.all()
		payload = {
			'statuses':{}
		}
		for p in players:
			payload['statuses'][p.id] = {
				'name':p.name
			}
			if p.color: 
				payload['statuses'][p.id]['color'] = p.color
			if p.vote:
				payload['statuses'][p.id]['vote'] = p.vote
			print 'player',p, '=', payload['statuses'][p.id]
		print 'sending plyer status to %s'%self, payload['statuses'].keys()  
		self.ws_group.send({'text':json.dumps(payload)})
		self.ws_group.send({'text':json.dumps({'ready':self.ready()})})

	def broadcast(self, msg):
		self.ws_group.send({'text':json.dumps(msg)})
	
	def ready(self):
		''' returns true if the lobby is ready to begin play. 
			which means there is more than one player and everyone has 
			selected a color
		'''
		ready = len(self.player_set.all()) > 1
		players = self.player_set.all()
		for p in players:
			if not p.color: ready = False
		return ready

	def get_majority_vote(self):
		''' figures out the majority vote from the player in the lobby
			if there's a tie decide pseudo-randomly.
		'''

		players = self.player_set.all()
		votes = [player.vote for player in players if player.vote != None]
		votemap = {}
		maximum = ('default',0)  # occuring element, occurances
		for v in votes:  # go through all the votes
			if v in votemap: votemap[v] += 1
			else: votemap[v] = 1
			if votemap[v] > maximum[1]: maximum = (v, votemap[v])
		print 'found majority to be', maximum[0], 'from ', votes
		version = Version.objects.get(version=maximum[0])
		return version

		
	def __str__(self): return self.title


class Player(models.Model):

	name = models.CharField(max_length=20)
	color = models.CharField(max_length=20, choices=COLOR_OPTIONS, 
		blank=True, null=True)
	lobby = models.ForeignKey(Lobby)
	userid = models.IntegerField()
	order = models.PositiveIntegerField(null=True, blank=True)
	vote = models.CharField(max_length=20, choices=VERSION_OPTIONS, null=True, blank=True)
	
	def __str__(self):
		if(self.color):
			return '%s:%s (%s) :%s'%(self.lobby, self.name, self.color, self.id)
		return '%s:%s :%s'%(self.lobby, self.name, self.id)

	class Meta:
	    unique_together = ('userid', 'lobby',)

class Version(models.Model):
	version = models.CharField(max_length=20, 
		choices=VERSION_OPTIONS, default='default')

	def __str__(self): return self.version


class Game(models.Model):
	lobby = models.OneToOneField(Lobby)
	version = models.ForeignKey(Version)
	currentplayer = models.ForeignKey(Player)
	gamephase = models.CharField(max_length=20, choices=GAME_PHASE_OPTIONS)
	turnphase = models.CharField(max_length=20, choices=TURN_PHASE_OPTIONS)

	def __str__(self):
		return str(self.lobby)

	def send_status(self):
		payload = {
			'hexes':[h.as_dict() for h in self.hex_set.all()],
			'pieces':[p.as_dict() for p in self.piece_set.all()]
		}
		print 'sending status', payload
		self.lobby.broadcast(payload)

	def populate(self):
		'''creates game status. depending on the version of the game.
		'''
		def createhex(resources, nums, row, col):
			resource = resources.pop(randrange(0,len(resources)))
			num = 7
			if resource != 'desert': num = nums.pop(randrange(0, len(nums))) 
			h = Hex.objects.create(
				game = self,
				resource = resource,
				number = num,
				row = row,
				col = col
			)
			h.full_clean()
			h.save()

		if(self.version.version == 'default'):
			hex_types = [
			'stone', 'stone', 'stone',
			'brick', 'brick', 'brick',  
			'wood', 'wood', 'wood', 'wood',
			'wheat', 'wheat', 'wheat', 'wheat',
			'sheep', 'sheep', 'sheep', 'sheep',
			'desert'
			]
			nums = [2,3,3,4,4,5,5,6,6,8,8,9,9,10,10,11,11,12]
			for i in range(1, 4): createhex(hex_types, nums, 0,i)
			for i in range(0, 4): createhex(hex_types, nums, 1,i)
			for i in range(0, 5): createhex(hex_types, nums, 2,i)
			for i in range(0, 4): createhex(hex_types, nums, 3,i)
			for i in range(1, 4): createhex(hex_types, nums, 4,i)
		print 'created hexes', self.hex_set.all()

	def clean(self):
		''' checks that the current player does in fact belong to this lobby
		'''
		print 'checking %s'%self
		# check that current player is in this lobby
		if self.currentplayer not in self.lobby.player_set.all():
			raise ValidationError('%s is not a part of this lobby'%self.currentplayer)


class Hex(models.Model):
	game = models.ForeignKey(Game)
	resource = models.CharField(max_length=20, 
		choices=RESOURCE_CHOICES,
		blank=True, null=True)
	number = models.PositiveIntegerField()
	row = models.PositiveIntegerField()
	col = models.PositiveIntegerField()

	def __str__(self):
		return '%s[%s][%s] %s:%s'%(self.game, 
			self.row, self.col, 
			self.resource, self.number)
	def as_dict(self):
		return {
			'resource':self.resource,
			'number':self.number,
			'row':self.row,
			'col':self.col
		}
	class Meta:
		unique_together = ('game', 'row', 'col')		


class Piece(models.Model):
	game = models.ForeignKey(Game)
	building = models.CharField(max_length=20, choices=BUILDING_CHOICES)
	player = models.ForeignKey(Player)
	loc = models.PositiveIntegerField()
	loc2 = models.PositiveIntegerField(blank=True, null=True)

	class Meta:
		unique_together = ('game','loc','loc2')

	def clean(self):
		''' used to validate a piece object
			if this is a road piece it must have a loc2.
			else loc2 must be none
		'''
		print 'checking %s'%self

		# check loc2 stuff
		if self.building == 'road':
			if self.loc2 == None: 
				raise ValidationError('roads must have 2 locations')
		else:  # if it's not a road
			if self.loc2 != None:
				raise ValidationError('only roads may use the loc2 field')

		# check player belongs to the correct game
		if self.player not in self.game.lobby.player_set.all():
			raise ValidationError('%s not in %s'%(self.player, self.game))

	def as_dict(self):
		return {
			'building': self.building,
			'color': self.player.color,
			'loc': self.loc,
			'loc2': self.loc2
		}


class Resource(models.Model):
	name = models.CharField(max_length=20, choices=RESOURCE_CHOICES)
	path = models.CharField(max_length=100, choices=RESOURCE_IMG_CHOICES)

	def __str__(self): return self.name


class Building(models.Model):
	name = models.CharField(max_length=20)
	versions = models.ManyToManyField(Version)

	def __str__(self): return '%s %s'%(self.name, self.versions)

	def as_dict(self): return {
		'name': self.name,
		'costs' : [c.as_dict() for c in self.cost_set.all()],
		'id':self.id
	}



class Cost(models.Model):
	building = models.ForeignKey(Building)
	resource= models.ForeignKey(Resource)

	def __str__(self): return '%s:%s'%(self.building, self.resource)

	def as_dict(self): return {
		'resource': self.resource,
		'path': self.resource.path 
	}