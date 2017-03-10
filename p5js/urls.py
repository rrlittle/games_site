from django.conf.urls import url
import views

urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^blob\.io', views.blobio, name='blob.io'),
	url(r'^maze', views.maze, name='maze'),
	url(r'^hexs', views.hexs, name='hexs'),
	url(r'^yinyang', views.yinyang, name='yinyang'),
	url(r'^testblob', views.testblob, name='textblob'),
	url(r'^natac', views.natac, name='natac'),

]


