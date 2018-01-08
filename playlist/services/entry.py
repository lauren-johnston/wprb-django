#!/usr/bin/env python
""" entry.py - Implements basic services for editing entry in a playlist. """

from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.http import QueryDict, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import F

from ..models import Spin, Playlist
from ..util import invalid_array_index, error, success, spin_to_dict
from music.models import Song, Artist, Album, Label, Genre, Subgenre
from music.common import get_or_create

import json

#@login_required
@csrf_exempt 
@require_http_methods(["POST"])
def add(request, playlist_id):
	""" Adds the song specified by the provided title, artist,
		album, and label to the playlist specified by the playlist_id 
		at the position specified by index. 
	"""
	print('Add received...')
	print(json.loads(request.body))
	args = json.loads(request.body)

	try:
		playlist    = Playlist.objects.get(pk=playlist_id)
		spins       = Spin.objects.filter(playlist__pk=playlist_id)
		song_title  = args['title']
		artist_name = args['artist']
		album_name  = args['album']
		label_name  = args['label']
		spin_index  = spins.count() + 1
	except Playlist.DoesNotExist:
		return error('Invalid URI')
	except (KeyError, ValueError):
		return error('Invalid request')

	if any(arg is '' for arg in (song_title, artist_name, album_name)):
		return error('Invalid request')


	# Get the artist, album, and song objects, creating each if necessary
	artist, album, song, label = get_or_create(artist_name, album_name, song_title)

	# Add the medium if it's provided
	new_spin = Spin(song=song, index=spin_index, playlist=playlist)
	if 'medium' in request.POST:
		new_spin.medium = request.POST['medium']

	new_spin.save()

	# Update the playcounts on all our objects
	song.playcount = F('playcount') + 1
	artist.playcount = F('playcount') + 1
	album.playcount = F('playcount') + 1

	# Hacky, forgive me
	response = {
		"ok": True,
		"spin": spin_to_dict(new_spin)
	}
	
	return JsonResponse(response)

@require_http_methods(["GET"])
def get_playlist_spins(request, playlist_id):
	''' A helper method. Does what it says. 
	'''
	try:
		playlist = Playlist.objects.get(pk=playlist_id)
		spins    = Spin.objects.filter(playlist__pk=playlist_id)
	except Playlist.DoesNotExist:
		return error('Invalid URI')

	# Hacky, to get around serialization issues
	list_of_spin_dicts = []
	for spin in spins:
		list_of_spin_dicts.append({
			'index':spin.index,
			'title':spin.song.name,
			'artist':spin.artist.name,
			'album':spin.album.name,
			})
	return to_return

#@login_required
@csrf_exempt 
@require_http_methods(["PUT"])
def move(request, playlist_id):
	""" Moves the spin specified by the given 'oldIndex' to the index
		specified by 'newIndex'. 
	"""
	try:
		args         = json.loads(request.body)
		old_index    = int(args['oldSpindex'])
		new_index    = int(args['newSpindex'])
		spins        = Spin.objects.filter(playlist__pk=playlist_id)
		target_spin  = spins.get(index=args['oldSpindex'])
	except (KeyError, ValueError):
		return error('Invalid request')
	except Spin.DoesNotExist:
		return error('No matching spin')
	except Spin.MultipleObjectsReturned:
		print(spins.filter(index=args['oldSpindex']))
		return error('Multiple spins with same index!')

	if invalid_array_index(spins, old_index):
		return error('Check with your db admin')
	if invalid_array_index(spins, new_index):
		return error('Invalid index')

	# Two sets to update depending on if spin was moved up or down
	if (old_index == new_index):
		return success()

	# If you moved it up, move others down
	elif(old_index > new_index):
		spins_to_increment = spins.filter(index__lt=old_index, index__gte=new_index)
		for spin in spins_to_increment:
			spin.index = F('index') + 1
			spin.save()

	# If you moved it down, move others up
	else:
		spins_to_decrement = spins.filter(index__gt=old_index, index__lte=new_index)
		for spin in spins_to_decrement:
			spin.index = F('index') - 1
			spin.save()
		

	# Update target spin and save
	target_spin.index = new_index
	target_spin.save()

	print('just saved ...')
	print(target_spin)

	return success()

#@login_required
@csrf_exempt 
@require_http_methods(["DELETE"])
def delete(request, playlist_id):
	""" Deletes the spin specified by the given pk from the 
		playlist specified in the URI. 
	"""

	try:
		args = json.loads(request.body)
		spin = Spin.objects.get(id=args['id'])
		index = spin.index
	except KeyError:
		return error('Invalid request')
	except Spin.DoesNotExist:
		return error('No matching spin')

	# Update the playcounts
	spin.song.playcount = F('playcount') - 1
	spin.song.save()
	spin.song.album.playcount = F('playcount') - 1
	spin.song.album.save()
	spin.song.artist.update(playcount=F('playcount') - 1)

	# Delete the spin from the database and update other playlist indices
	spin.delete()
	spins_to_update = Spin.objects.filter(playlist_id=playlist_id).filter(index__gt=index)
	for s in spins_to_update:
		s.index = F('index') - 1
		s.save()

	return JsonResponse({'ok': True})

#@login_required
@csrf_exempt
@require_http_methods(["PUT"])
def update(request, playlist_id):
	""" Updates the specified entry with provided basic spin dict 
	"""
	print('Update received...')
	print(json.loads(request.body))
	args = json.loads(request.body)

	try: 
		spin = Spin.objects.get(id=args['id'])
	except KeyError:
		return error('Invalid request')
	except Spin.DoesNotExist:
		return error('No matching spin')

	try:
		artist, album, song, label = get_or_create(args['artist'], args['album'], args['title'])
	except (KeyError, ValueError):
		return error('Invalid request')

	spin.song = song
	spin.save()

	# if 'title' in args:
	# 	song = Song.objects.get_or_create(name=args['title'], artist=spin.song.artist, album=spin.song.album)

	# 	song.playcount += 1
	# 	if spin.song.playcount <= 1: 
	# 		spin.song.delete()

	# 	spin.update(song=song)

	# elif 'album' in args:
	# 	album = Album.objects.get_or_create(name=args['album'])
	# elif 'artist' in args:
	# 	artist = Artist.objects.get_or_create(name=args['artist'])
	# elif 'label' in args:
	# 	label = Label.objects.get_or_create(name=args['label'])
	

	return JsonResponse({
		'ok': True,
		'spin': spin_to_dict(spin)
	})


#@login_required
@csrf_exempt
@require_http_methods(["GET"])
def complete(request, playlist_id):
	""" Updates the specified entry with provided basic spin dict 
	"""
	args         = request.GET
	identifier   = args.get('identifier')
	value        = args.get('value')

	if identifier not in ['title', 'artist', 'album', 'label']:
		return error('Invalid request - hone identifier!')

	if value is None or value == '':
		return JsonResponse({'ok': True, 'suggestions':[]})

	if identifier == 'title':
		suggestions = [{
			'song'   : s.name,
			'album'  : s.album.name,
			'artist' : ' & '.join([a.name for a in s.artist.all()])
		} for s in Song.objects.filter(name__startswith=value)]
	elif identifier == 'artist':
		suggestions = [a.name for a in Artist.objects.filter(name__startswith=value)]
	elif identifier == 'album':
		suggestions = [a.name for a in Album.objects.filter(name__startswith=value)]
	elif identifier == 'label':
		suggestions = [l.name for l in Label.objects.filter(name__startswith=value)]
	else:
		suggestions = []

	return JsonResponse({
		'ok': True,
		'suggestions': suggestions
	})
