"""
This conf will match URLs that begin with '/playlist',a
and are redirected from the main urlconf at radio.urls

Urls on the /playlist/ path will relate to playlist administration
and editing
"""

from django.conf.urls import url, include
from django.contrib import admin

from . import views, services

playlist_id = r'^(?P<playlist_id>[0-9]+)/'

urlpatterns = [
	url( playlist_id + '$', views.edit_playlist, name='edit-playlist'),

	# Intra-Playlist services
	url( playlist_id + 'entry/add/$',      services.entry.add,      name='entry-add'),
	url( playlist_id + 'entry/move/$',     services.entry.move,     name='entry-move'),
	url( playlist_id + 'entry/delete/$',   services.entry.delete,   name='entry-delete'),
	url( playlist_id + 'entry/update/$',   services.entry.update,   name='entry-update'),
	url( playlist_id + 'entry/complete/$', services.entry.complete, name='entry-complete'),

	# Meta-Playlist services
	url( playlist_id + 'meta/title/$',     services.meta.title,     name='meta-title'),
	url( playlist_id + 'meta/desc/$',      services.meta.desc,      name='meta-desc'),
	url( playlist_id + 'meta/genre/$',     services.meta.genre,     name='meta-genre'),
	url( playlist_id + 'meta/subgenre/$',  services.meta.subgenre,  name='meta-subgenre'),

	# Comments
	url(playlist_id + 'comment/new', services.comment.new, name='comment-new'),
	url(playlist_id + 'comment/edit', services.comment.edit, name='comment-edit'),
	url(playlist_id + 'comment/delete', services.comment.delete, name='comment-delete'),

]
