from django.shortcuts import render
from models import Room
# Create your views here.
def index(request):
	rooms = Room.objects.order_by('title')

	return render(request, 'goodchat/index.html',{'rooms':rooms})
