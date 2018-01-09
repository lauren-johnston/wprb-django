"""
This conf will match URLs that begin with '/playlist',a
and are redirected from the main urlconf at radio.urls

Urls on the /playlist/ path will relate to playlist administration
and editing
"""

from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.views.generic.base import RedirectView

from . import views, services, explore
from .views import edit_playlist
from .services import entry, meta, comment, charts, search

LOGIN_URL = 'login'
LOGOUT_URL = 'logout'
LOGIN_REDIRECT_URL = 'home'

playlist_id = r'^(?P<playlist_id>[0-9]+)/'

app_name = 'playlist'
favicon_view = RedirectView.as_view(url='static/favicon.ico', permanent=True)

urlpatterns = [

	url(r'^favicon.ico$', favicon_view),

	# Explore View
	url(r'^explore/', include([
		url(r'^$', views.explore_landing, name='home'),
		url(r'^(?P<field>[a-zA-Z]+)/(?P<field_id>[0-9]+)/$', views.explore, name='explore'),
		url(r'^charts/$', charts.charts, name='charts'),
	])),
	
	url(r'^playlist/', include([
		# playlist edit
		url(playlist_id + '$', views.edit_playlist, name='edit-playlist'),

		# New Playlist
		url(r'^new/$', views.new_playlist, name='new-playlist'),

		# Authentication
		url(r'^login/$',  auth_views.login,  name='login'),
		url(r'^logout/$', auth_views.logout, name='logout'),
		
		#url(r'^oauth/', include('social_django.urls', namespace='social')),

		# Landing Page
		url(r'^$', views.landing),

		#search GET Request
		url(r'^search/$', services.search.search, name='search'),

		# Intra-Playlist services
		url(playlist_id + 'entry/add/$',      services.entry.add,      name='entry-add'),
		url(playlist_id + 'entry/move/$',     services.entry.move,     name='entry-move'),
		url(playlist_id + 'entry/delete/$',   services.entry.delete,   name='entry-delete'),
		url(playlist_id + 'entry/update/$',   services.entry.update,   name='entry-update'),
		url(playlist_id + 'entry/complete/$',   services.entry.complete,   name='entry-complete'),

		# Meta-Playlist services
		url(playlist_id + 'meta/desc/$',          services.meta.desc,          name='meta-desc'),
		url(playlist_id + 'meta/genre/$',         services.meta.genre,         name='meta-genre'),
		url(playlist_id + 'meta/subtitle/$',      services.meta.subtitle,      name='meta-title'),
		url(playlist_id + 'meta/add_subgenre/$',  services.meta.add_subgenre,  name='meta-add_subgenre'),
		url(playlist_id + 'meta/del_subgenre/$',  services.meta.del_subgenre,  name='meta-del_subgenre'),

		# Comments
		url(playlist_id + 'comment/new',      services.comment.new,    name='comment-new'),
		url(playlist_id + 'comment/edit',     services.comment.edit,   name='comment-edit'),
		url(playlist_id + 'comment/delete',   services.comment.delete, name='comment-delete'),
	])),
]
