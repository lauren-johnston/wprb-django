from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie, csrf_exempt
from django.shortcuts import render

from .models import *

@csrf_exempt
def edit_playlist(request, playlist_id):
	""" Serve the page for editing a single playlist.
	"""

	show = {
		'title'  	: 'A Cool Show',
		'subtitle'	: 'with a subtitle: ' + playlist_id,
		'dj'		: ['One DJ', 'And Another'],
		'genre'		: 'The Main genre',
		'subgenre'	: ['A mike genre', 'shit-slop funk bass', 'fruit loops'],
		'desc'		: 'Here you can talk about this episode of your show. Anything in particular you want to say?'
	}

	# playlist = Playlist.objects.get(pk=playlist_id)

	# spins = [{
	# 	'title'	: spin.song.title
	# 	'artist': [a.name for a in spin.song.artist],
	# 	'album'	: spin.song.album.name
	# } for spin in playlist.spin_set]

	spins = [{
		'title'	: 'Track %d' % i,
		'artist': ['Artist %d' % i],
		'album'	: 'Album %d' % i
	} for i in range(10)]


	return render(request, "edit.html", context={'spins': spins, 'show': show})