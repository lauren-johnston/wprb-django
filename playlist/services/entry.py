#!/usr/bin/env python

''' entry.py - Implements basic services for editing entry in a playlist. '''


def add(request, playlist_id):
	''' Adds the song specified by the provided title, artist,
		album, and label to the playlist specified by the plistId 
		at the position specified by position. 
	'''
	plist = Playlist.objects.filter(id=playlist_id)

	pass

def move(request, playlist_id):
	''' Moves the song specified by the given entryId to the position
		specified by position. 
	'''
	pass

def delete(request, playlist_id):
	''' Deletes the entry specified by the given entryId from the 
		playlist specified in the URI. 
	'''
	pass

def update(request, playlist_id):
	''' Updates the specified entry with the information provided. '''
	pass

def complete(request, playlist_id):
	''' Returns a list of songs that *match* the provided
	    title, artist, album, and label, which can all be 
		incomplete strings. 
	'''
	pass