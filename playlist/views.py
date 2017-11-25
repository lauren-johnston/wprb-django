from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404

from .models import *
from .common import *

from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie

#@login_required
def new_playlist(request):
    """ Create a new playlist object, and then redirect to the
    edit page for that playlist
    """

    # TODO: Get the DJ from the request and then associate
    # the playlist with that dj
    playlist = Playlist()
    playlist.save()

    return redirect('/playlist/%d/' % playlist.id)


@login_required(login_url = 'playlist:login')
def edit_playlist(request, playlist_id):
    """ Serve the page for editing a single playlist.
    """
    playlist = get_object_or_404(Playlist, pk=playlist_id)

    showdetails = {
        'title'     : playlist.show.name,
        'subtitle'  : playlist.subtitle,
        'dj'        : [dj.name for dj in playlist.show.dj.all()],
        'genre'     : playlist.genre.name if playlist.genre else None,
        'subgenre'  : [g.name for g in playlist.subgenre.all()],
        'desc'      : playlist.desc
    }

    spins = [{
        'id'    : spin.id,
        'title' : spin.song.name,
        'artist': [a.name for a in spin.song.artist.all()],
        'album' : spin.song.album.name,
        'index' : spin.index,
    } for spin in playlist.spin_set.all()]

    context = {
        'props' : {'spins': spins, 'show': showdetails},
        'bundle': 'playlist',
        'styles': ['edit'],
        'title' : 'Playlist Editor'
    }

    return render(request, "component.html", context=context)