from django.conf.urls import url
import views
from django.contrib.auth import views as auth_views

urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^lobby/(?P<lobbyid>[0-9]+)$', views.lobby, name='lobby'),
	url(r'^game/(?P<gameid>[0-9]+)$', views.game, name='game'),
	url(r'^newlobby', views.newlobby, name='newlobby'),
	url(r'^login', views.login_view, name='login'),
	url(r'^logout', auth_views.logout,
		{'next_page': 'catan:index'}, name='logout'),

]
