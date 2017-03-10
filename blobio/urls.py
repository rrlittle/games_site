from django.conf.urls import url
import views


urlpatterns = [
	url(r'^(?P<lobby>[0-9]+)$', views.index, name='index'),
]


