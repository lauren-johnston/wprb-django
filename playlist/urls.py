"""
This conf will match URLs that begin with '/playlist',a
and are redirected from the main urlconf at radio.urls

Urls on the /playlist/ path will relate to playlist administration
and editing
"""

from django.conf.urls import url, include
from django.contrib import admin

from . import views
from . import services

PLAYLIST_ID = r'^(?P<playlist_id>[0-9]+)/'

urlpatterns = [
	url( PLAYLIST_ID + '$', views.edit_playlist, name='edit-playlist'),

	url( PLAYLIST_ID + 'entry/add/$',      services.entry.add,      name='entry-add'),
	url( PLAYLIST_ID + 'entry/move/$',     services.entry.move,     name='entry-move'),
	url( PLAYLIST_ID + 'entry/delete/$',   services.entry.delete,   name='entry-delete'),
	url( PLAYLIST_ID + 'entry/update/$',   services.entry.update,   name='entry-update'),
	url( PLAYLIST_ID + 'entry/complete/$', services.entry.complete, name='entry-complete'),

	url( PLAYLIST_ID + 'meta/title/$',     services.meta.title,     name='meta-title'),
	url( PLAYLIST_ID + 'meta/desc/$',      services.meta.desc,      name='meta-desc'),
	url( PLAYLIST_ID + 'meta/genre/$',     services.meta.genre,     name='meta-genre'),
	url( PLAYLIST_ID + 'meta/subgenre/$',  services.meta.subgenre,  name='meta-subgenre'),
]
