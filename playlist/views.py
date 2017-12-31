from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404, redirect

from .models import *
from .util import *
from .explore import plays, details

from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie

import time, datetime

#****************************************************************************************
# Playlist Views
#****************************************************************************************

@login_required
def landing(request):
    userinfo = get_user_details(request)
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
        'playlists' : playlists,
        'props': {'userinfo' : userinfo}
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
    userinfo = get_user_details(request)
    """ Serve the page for editing a single playlist.
    """
    playlist = get_object_or_404(Playlist, pk=playlist_id)

    showdetails = {
        'title'     : playlist.show.name,
        'subtitle'  : playlist.subtitle,
        'dj'        : [dj.name for dj in playlist.show.dj.all()],
        'genre'     : playlist.genre.name if playlist.genre else None,
        'subgenre'  : [g.name for g in playlist.subgenre.all()],
        'desc'      : playlist.desc,
        'id'        : playlist_id
    }

    spins = sorted([{
        'id'    : spin.id,
        'title' : spin.song.name,
        'artist': spin.song.artist.all()[0].name,
        'album' : spin.song.album.name,
        'index' : spin.index,
    } for spin in playlist.spin_set.all()], key=lambda x: x['index'])

    comments = [{
        'id'        : comment.id,
        'text'      : comment.text,
        'timestamp' : time.mktime(comment.timestamp.timetuple()),
        'author'    : comment.author.username if comment.author else 'anonymous'
    } for comment in Comment.objects.filter(playlist=playlist_id)]

    context = {
        'props' : {'spins': spins, 'show': showdetails, 'comments': comments, 'userinfo' : userinfo},
        'bundle': 'playlist',
        'title' : 'Playlist Editor'
    }

    return render(request, "component.html", context=context)

#****************************************************************************************
# Explore Views
#****************************************************************************************

def explore(request, field, field_id):
    userinfo = get_user_details(request)
    """ Render the page with the explore component and relevant info.
    """

    # Find the proper explore template to render
    if field == 'dj':
        return explore_dj(request, field_id)
    if field == 'playlist':
        return explore_playlist(request, field_id)
    if field in ['artist', 'album', 'song', 'label']:
        return explore_music(request, field, field_id)

    raise Http404('What is a %s?' % field)

def explore_music(request, field, field_id):
    # Get all the plays
    p, title = plays(field, int(field_id))

    context = {
        'title': 'Explore %ss' % field.capitalize(),
        'props': {'plays': p, 'title' : title, 'userinfo' : userinfo}
        'bundle': 'explore-music',
    }

    return render(request, "component.html", context=context)

def explore_dj(request, dj_id):
    """ Render the explore page for a particular DJ
    """
    dj = get_object_or_404(DJ, pk=dj_id)

    playlists = sorted([{
        'id'        : playlist.id,
        'title'     : playlist.show.name,
        'subtitle'  : playlist.subtitle,
        'date'      : date_to_str(playlist.date)
    } for playlist in Playlist.objects.filter(show__dj=dj)], key=lambda x: x['id'], reverse=True)   

    context = {
        'props' : {'title': dj.name, 'playlists': playlists},
        'bundle': 'explore-dj',
        'title' : 'Explore DJs: %s' % dj.name
    }

    return render(request, "component.html", context=context)


def explore_playlist(request, playlist_id):
    """ Render the explore page for a particular playlist.
    """
    playlist = get_object_or_404(Playlist, pk=playlist_id)

    # Get playlist details
    showdetails = {
        'title'     : playlist.show.name,
        'subtitle'  : playlist.subtitle,
        'dj'        : [dj.name for dj in playlist.show.dj.all()],
        'genre'     : playlist.genre.name if playlist.genre else None,
        'subgenre'  : [g.name for g in playlist.subgenre.all()],
        'desc'      : playlist.desc,
        'date'      : date_to_str(playlist.date),
        'id'        : playlist_id,
        'time'      : playlist.start_time,
        'length'    : playlist.length
    }

    # Get spins
    spins = sorted([{
        'id'        : spin.id,
        'index'     : spin.index,
        'artist'    : spin.song.artist.all()[0].name,
        'artistId'  : spin.song.artist.all()[0].id,
        'song'      : spin.song.name,
        'songId'    : spin.song.id,
        'album'     : spin.song.album.name,
        'albumId'   : spin.song.album.id,
        'label'     : spin.song.album.label.name if spin.song.album.label else None,
        'labelId'   : spin.song.album.label.id if spin.song.album.label else None,
    } for spin in playlist.spin_set.all()], key=lambda x: x['index'])

    # Get playlist comments
    comments = [{
        'id'        : comment.id,
        'text'      : comment.text,
        'timestamp' : time.mktime(comment.timestamp.timetuple()),
        'author'    : comment.author.username if comment.author else 'anonymous'
    } for comment in Comment.objects.filter(playlist=playlist_id)]

    context = {
        'props' : {'spins': spins, 'show': showdetails, 'comments': comments},
        'bundle': 'explore-playlist',
        'title' : 'Explore Playlists: %s on %s' % (showdetails['title'], showdetails['date'])
    }

    return render(request, "component.html", context=context)
