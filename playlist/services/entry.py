#!/usr/bin/env python
''' entry.py - Implements basic services for editing entry in a playlist. '''

from django.http import QueryDict, HttpResponse
from django.views.decorators.http import require_http_methods

@require_http_methods(["POST"])
def add(request, playlist_id):
	''' Adds the song specified by the provided title, artist,
		album, and label to the playlist specified by the plistId 
		at the position specified by position. 
	'''
	post = request.POST
	playlist = Playlist.objects.filter(id=playlist_id)

	pass

@require_http_methods(["PUT"])
def move(request, playlist_id):
	''' Moves the song specified by the given entryId to the position
		specified by position. 
	'''
	put = QueryDict(request.body)
	playlist = Playlist.objects.filter(id=playlist_id)

	length   = Spin.objects.filter(playlist=playlist_id)
	if(put['position'] > length) 


	pass

@require_http_methods(["DELETE"])
def delete(request, playlist_id):
	''' Deletes the entry specified by the given entryId from the 
		playlist specified in the URI. 
	'''
	delete = QueryDict(request.body)
	playlist = Playlist.objects.filter(id=playlist_id)

	pass

@require_http_methods(["PUT"])
def update(request, playlist_id):
	''' Updates the specified entry with the information provided. '''
	put = QueryDict(request.body)
	playlist = Playlist.objects.filter(id=playlist_id)
	pass

@require_http_methods(["GET"])
def complete(request, playlist_id):
	''' Returns a list of songs that *match* the provided
	    title, artist, album, and label, which can all be 
		incomplete strings. 
	'''
	get = request.GET
	playlist = Playlist.objects.filter(id=playlist_id)
	return "hello"