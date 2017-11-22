from django.http import JsonResponse
from django.shortcuts import render

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


def login(request):
    print('here0')
    return render(request, "login.html", context={'message':"MMM"})


def handlelogin(request):
    print('here1')
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return HttpResponseRedirect(reverse('playlist:edit-playlist'))
    else:
        return render(request, 'login.html', context={'message': "Invalid username / password combination"})



@login_required(login_url = 'playlist:login')
def edit_playlist(request, playlist_id):
    """ Serve the page for editing a single playlist.
    """
    try:
        playlist = Playlist.objects.get(pk=playlist_id)
    except Playlist.DoesNotExist:
        return error("No such playlist")


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
    } for spin in playlist.spin_set.all()]

    return render(request, "edit.html", context={'spins': spins, 'show': showdetails})

