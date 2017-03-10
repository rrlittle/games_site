from django.shortcuts import render

# Create your views here.
def index(request):
	return render(request, 'p5js/index.html')

def blobio(request):
	return render(request, 'p5js/blobio.html')

def maze(request):
	return render(request, 'p5js/maze.html')

def hexs(request):
	return render(request, 'p5js/hexs.html')

def yinyang(request):
	return render(request, 'p5js/yinyang.html')

def testblob(request):
	return render(request, 'p5js/testblob.html')

def natac(request):
	return render(request, 'p5js/natac.html')