#!/usr/bin/env python
''' entry.py - Implements basic services for editing entry in a playlist. '''

from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.http import QueryDict, HttpResponse, JsonResponse
from django.db.models import Q

from ..models import Spin, Playlist
from music.models import Song, Artist, Album, Label, Genre, Subgenre
from ..common import * 

@login_required
@require_http_methods(["POST"])
def add(request, playlist_id):
	''' Adds the song specified by the provided title, artist,
		album, and label to the playlist specified by the playlist_id 
		at the position specified by index. 
	'''
	try:
		playlist = Playlist.objects.get(pk=playlist_id)
		spins  = Spin.objects.filter(playlist__pk=playlist_id)
		title  = request.POST['title']
		artist = request.POST['artist']
		album  = request.POST['album']
		label  = request.POST['label']
		index  = int(request.POST['index'])
	except Playlist.DoesNotExist:
		return error('Invalid URI')
	except KeyError, ValueError:
		return error('Invalid request')

	if invalid_array_index(spins, index-1):
	   return error('Invalid index')

	# See if the song already exists, if so, grab it
	# Do we want to be more lenient, on matching?
	try: 
		match = Song.objects.get(
			Q(name__iexact=title),
			Q(artist__name__iexact=artist),
			Q(album__name__iexact=album),
			Q(album__label__name__iexact=label)
			)
	except Song.DoesNotExist:
		# Do this later
		return error('no song')

	# Let's talk about mediums and time-stamps
	new_spin = Spin(song=match, index=index, playlist=playlist)
	if 'timestamp' in request.POST:
		new_spin.timestamp = request.POST['timestamp']
	if 'medium' in request.POST:
		new_spin.medium = request.POST['medium']

	new_spin.save()

	# Finally, shift the playlist if need be
	spins_to_update = spins.filter(index__gt=index)
	for spin in spins_to_update:
		spin.index = spin.index + 1
		spin.save()

	return success()


@login_required
@require_http_methods(["PUT"])
def move(request, playlist_id):
	''' Moves the spin specified by the given 'spin_pk' to the index
		specified by 'index'. 
	'''
	try:
		args         = QueryDict(request.body)
		spins        = Spin.objects.filter(playlist__pk=playlist_id)
		target_spin  = spins.get(pk=args['spin_pk'])
		old_index    = spin.index
		new_index    = int(args['index'])
	except KeyError, ValueError:
		return error('Invalid request')
	except Spin.DoesNotExist:
		return error('No matching spin')

	if invalid_array_index(spins, old_index):
		return error('Check with your db admin')
	if invalid_array_index(spins, new_index):
		return error('Invalid index')

	spins_to_update = spins.filter(index__gt =old_index, index__lte=new_index)

	# Update target spin and save
	target_spin.index = new_index
	target_spin.save()

	# Update following spins and save
	for spin in spins_to_update:
		spin.index = spin.index - 1
		spin.save()

	return success()

@login_required
@require_http_methods(["DELETE"])
def delete(request, playlist_id):
	''' Deletes the spin specified by the given pk from the 
		playlist specified in the URI. 
	'''
	try:
		args         = QueryDict(request.body)
		spins        = Spin.objects.filter(playlist__pk=playlist_id)
		target_spin  = spins.get(pk=args['spin_pk'])
		index        = spin.index
	except KeyError:
		return error('Invalid request')
	except Spin.DoesNotExist:
		return error('No matching spin')

	if invalid_array_index(spins, index):
		return error('Invalid index')

	spins_to_update = spins.filter(index__gt=index)

	#Perform the operation
	target_spin.delete()
	for spin in spins_to_update:
		spin.index = spin.index - 1
		spin.save()

	return success()

@login_required
@require_http_methods(["PUT"])
def update(request, playlist_id):
	''' Updates the specified entry with the information provided. '''
	try: 
		args         = QueryDict(request.body)
		spins        = Spin.objects.filter(playlist__pk=playlist_id)
		target_spin  = spins.get(pk=args['spin_pk'])
	except KeyError:
		return error('Invalid request')
	except Spin.DoesNotExist:
		return error('No matching spin')

	# Will do this part later
	return success()

@require_http_methods(["GET"])
def complete(request, playlist_id):
	''' Returns a list of songs that *match* the provided
	    title, artist, album, and label, which can all be 
		incomplete strings. 
	'''
	get = request.GET

	# Filter songs by query, case insensitively
	songs = Songs.objects.all()
	if 'title' in get:
		songs = songs.filter(name__icontains=get['title'])
	if 'artist' in get:
		songs = songs.filter(artist__name__icontains=get['artist'])
	if 'album' in get:
		songs = songs.filter(album__name__icontains=get['album'])
	if 'label' in get:
		songs = songs.filter(album__label__name__icontains=get['label'])

	return JsonResponse({'matches': songs})