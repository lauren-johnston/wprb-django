from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404, redirect

from .models import *
from .util import *
from .explore import plays, details

from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie

@login_required
def landing(request):
    """ Serve the landing page for a dj that allows them to 
    access their previous playlists for editing or create 
    a new playlist.
    """ 
    dj = request.user.dj

    playlists = sorted([{
        'id'        : playlist.id,
        'title'     : playlist.show.name,
        'subtitle'  : playlist.subtitle,
        'date'      : date_to_str(playlist.date)
    } for playlist in Playlist.objects.filter(show__dj=dj)], key=lambda x: x['id'], reverse=True)   

    context = {
        'dj'        : dj.name,
        'playlists' : playlists
    }

    return render(request, "landing.html", context=context)


@login_required
def new_playlist(request):
    """ Create a new playlist object, and then redirect to the
    edit page for that playlist
    """

    show = request.user.dj.show_set.all().first()
    playlist = Playlist(show=show)
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

    spins = sorted([{
        'id'    : spin.id,
        'title' : spin.song.name,
        'artist': [a.name for a in spin.song.artist.all()],
        'album' : spin.song.album.name,
        'index' : spin.index,
    } for spin in playlist.spin_set.all()], key=lambda x: x['index'])

    context = {
        'props' : {'spins': spins, 'show': showdetails},
        'bundle': 'playlist',
        'styles': ['edit'],
        'title' : 'Playlist Editor'
    }

    return render(request, "component.html", context=context)

def explore(request, field, field_id):
    """ Render the page with the explore component and relevant info.
    """
    context = {
        'bundle': 'explore',
        'title': 'Explore %ss' % field.capitalize(),
        'props': {'plays': plays(field, int(field_id))}
    }

    return render(request, "component.html", context=context)