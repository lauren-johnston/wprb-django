#!/usr/bin/env python

'''
	entry.py 
	Implements basic services for editing entry in a playlist.

'''


def add(plistId, title, artist, album, label, position):
	'''
		Adds the song specified by the provided title, artist,
		album, and label to the playlist specified by the plistId 
		at the position specified by position. 
	'''
	plist = Playlist.objects.filter(id=plistId)

	pass

def move(entryId, position):
	'''
		Moves the song specified by the given entryId to the position
		specified by position. 
	'''
	pass

def delete(entryId):
	'''
		Deletes the entry specified by the given entryId from the 
		playlist specified in the URI. 
	'''
	pass

def update(entryId, title, artist, album, label):
	'''
		Updates the specified entry with the information provided.
	'''
	pass

def complete(title, artist, album, label):
	''' 
		Returns a list of songs that *match* the provided
		title, artist, album, and label, which can all be 
		incomplete strings. 
	'''
	pass