from django.shortcuts import render

# Create your views here.
def index(request, lobby):
	context = {'lobby':lobby}
	return render(request, 'blobio/index.html', context)