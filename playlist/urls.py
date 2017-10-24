"""
This conf will match URLs that begin with '/playlist',a
and are redirected from the main urlconf at radio.urls

Urls on the /playlist/ path will relate to playlist administration
and editing
"""

from django.conf.urls import url, include
from django.contrib import admin

from . import views

playlist_id = r'^(?P<playlist_id>[0-9]+)/'

urlpatterns = [
	url(playlist_id + '$', views.edit_playlist, name='edit-playlist'),
]
