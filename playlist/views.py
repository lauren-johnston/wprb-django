from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie, csrf_exempt
from django.http import JsonResponse
from django.shortcuts import render

from .models import *
from .common import *

#@login_required
def new_playlist(request):
	""" Create a new playlist object, and then redirect to the
	edit page for that playlist
	"""

	# TODO: Get the DJ from the request and then associate
	# the playlist with that dj
	playlist = Playlist()

	return redirect('/playlist/%d/' % playlist.id)

#@login_required
def edit_playlist(request, playlist_id):
	""" Serve the page for editing a single playlist.
	"""
	try: 
		playlist = Playlist.objects.get(pk=playlist_id)
	except Playlist.DoesNotExist:
		return error("No such playlist")


	showdetails = {
		'title'  	: playlist.show.name,
		'subtitle'	: playlist.subtitle,
		'dj'		: [dj.dj_name for dj in playlist.show.dj.all()],
		'genre'		: playlist.genre.name if playlist.genre else None,
		'subgenre'	: [g.name for g in playlist.subgenre.all()],
		'desc'		: playlist.desc
	}

	spins = [{
		'title'	: spin.song.name,
		'artist': [a.name for a in spin.song.artist.all()],
		'album'	: spin.song.album.name
	} for spin in playlist.spin_set.all()]

	return render(request, "edit.html", context={'spins': spins, 'show': showdetails})