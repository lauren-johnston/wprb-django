#!/usr/bin/env python
''' entry.py - Implements basic services for editing entry in a playlist. '''

from django.views.decorators.http import require_http_methods, login_required
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
	# Check that specified playlist exists
	if not Playlist.objects.filter(pk=playlist_id).exists():
		return errorJson('Specified playlist does not exist')
	playlist = Playlist.objects.get(pk=playlist_id)
	spins    = Spin.objects.filter(playlist__pk=playlist_id)

	# Check that all arguments are provided
	if 'title' not in request.POST or \
	if 'artist' not in request.POST or \
	if 'album'  not in request.POST or \
	if 'label'  not in request.POST or \
	if 'index'  not in request.POST: 
		return errorJson('Incomplete information')

	title  = request.POST['title']
	artist = request.POST['artist']
	album  = request.POST['album']
	label  = request.POST['label']
	index  = int(request.POST['index'])

	# Validate the index
	if (index > len(spins)) or \
	   (index < 0):
	   return errorJson('Invalid index')

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
		# Make a new song, make a new spin, load it up
		# I'll do this later, it's kinda intensive
		pass

	# Let's talk about mediums and time-stamps
	new_spin = Spin(song=match, index=index, playlist=playlist_id)
	if 'timestamp' in request.POST:
		new_spin.timestamp = request.POST['timestamp']
	if 'medium' in request.POST:
		new_spin.timestamp = request.POST['medium']

	new_spin.save()

	# Finally, shift the playlist if need be
	if (index < len(spins)):
		spins_to_update = spins.filter(index__gt=index)
		for spin in spins_to_update:
			spin.index = spin.index + 1
			spin.save()

	return successJson()


@login_required
@require_http_methods(["PUT"])
def move(request, playlist_id):
	''' Moves the spin specified by the given old_index to the position
		specified by new_index. 
	'''
	# Check that specified playlist exists
	if not Playlist.objects.filter(pk=playlist_id).exists():
		return errorJson('Specified playlist does not exist')

	# Retrieve playlist spins
	spins  = Spin.objects.filter(playlist__pk=playlist_id)

	# Validate query and arguments
	put = QueryDict(request.body)
	if 'old_index' not in put or \
	if 'new_index' not in put:
		return errorJson('Incomplete information')

	old_index = int(put['old_index'])
	new_index = int(put['new_index'])

	if (old_index > len(spins)) or \
	   (old_index < 0):
		return errorJson('Invalid old_index') 
	if (new_index > len(spins)) or \
	   (new_index < 0):
		return errorJson('Invalid new_index')

	# Filter for relevant spins
	target_spin     = spins.get(index=old_index)
	spins_to_update = spins.filter(index__gt =old_index) \
	                       .filter(index__lte=new_index)

	# Update target spin and save
	target_spin.index = new_index
	target_spin.save()

	# Update following spins and save
	for spin in spins_to_update:
		spin.index = spin.index - 1
		spin.save()

	return successJson()

@login_required
@require_http_methods(["DELETE"])
def delete(request, playlist_id):
	''' Deletes the spin specified by the given index from the 
		playlist specified in the URI. 
	'''
	# Check that specified playlist exists
	if not Playlist.objects.filter(pk=playlist_id).exists():
		return JsonResponse({'error' : 'Specified playlist does not exist' })

	# Retrieve playlist spins
	spins  = Spin.objects.filter(playlist__pk=playlist_id)

	# Validate query and arguments
	delete = QueryDict(request.body)
	if 'index' not in delete:
		return errorJson('Incomplete information')
	index = int(delete['index'])
	if (index > len(spins)) or \
	if (index < 0):
		return errorJson('Invalid index')

	# Retrieve relevant spins, trusting playlist contract
	target_spin = spins.get(index=index)
	spins_to_update = spins.filter(index__gt=index)

	#Perform the operation
	target_spin.delete()
	for spin in spins_to_update:
		spin.index = spin.index - 1
		spin.save()

	return successJson()

@login_required
@require_http_methods(["PUT"])
def update(request, playlist_id):
	''' Updates the specified entry with the information provided. '''


	# Check that specified playlist exists
	if not Playlist.objects.filter(pk=playlist_id).exists():
		return JsonResponse({'error' : 'Specified playlist does not exist' })

	# Retrieve playlist spins
	spins  = Spin.objects.filter(playlist__pk=playlist_id)

	# Validate query and args
	put = QueryDict(request.body)
	if not 'index' in put: 
		return errorJson('Index required')
	index = int(put['index'])
	if (index > len(spins)) or \
	if (index < 0):
		return errorJson('Invalid index')

	# Retrieve relevant spin, trusting playlist contract
	target_spin = spins.get(index=index)

	# Will do this part later

	pass

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