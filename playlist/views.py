from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404, redirect

from .models import *
from .util import *
from .explore import plays

from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie

import time, datetime

#****************************************************************************************
# Playlist Views
#****************************************************************************************

@login_required
def landing(request):
    """ Serve the landing page for a dj that allows them to 
    access their previous playlists for editing or create 
    a new playlist.
    """ 
    userinfo = get_user_details(request)

    dj = request.user.dj

    playlists = sorted([{
        'id'        : playlist.id,
        'title'     : playlist.show.name,
        'subtitle'  : playlist.subtitle,
        'date'      : playlist.datetime.timestamp()
    } for playlist in Playlist.objects.filter(show__dj=dj)], key=lambda x: x['id'], reverse=True)   

    context = {
        'dj'        : dj.name,
        'bundle'    : 'landing',
        'props'     : {'userinfo' : userinfo, 'playlists' : playlists, 'dj' : dj.name}
    }

    return render(request, "component.html", context=context)

@ensure_csrf_cookie
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
        'id'        : playlist_id,
        'datetime'  : playlist.datetime.timestamp()
    }

    spins = sorted([{
        'id'    : spin.id,
        'title' : spin.song.name,
        'artist': spin.song.artist.all()[0].name,
        'album' : spin.song.album.name,
        'label' : spin.song.album.label.name if spin.song.album.label != None else '',
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
    userinfo = get_user_details(request)

    # Get all the plays
    p, title = plays(field, int(field_id))

    context = {
        'title' : 'Explore %ss' % field.capitalize(),
        'bundle': 'explore-music',
        'props' : {'spins': p, 'title' : title, 'userinfo' : userinfo, 'field': field},
    }

    return render(request, "component.html", context=context)

def explore_dj(request, dj_id):
    """ Render the explore page for a particular DJ
    """
    userinfo = get_user_details(request)

    dj = get_object_or_404(DJ, pk=dj_id)

    playlists = sorted([{
        'id'        : playlist.id,
        'title'     : playlist.show.name,
        'subtitle'  : playlist.subtitle,
        'date'      : playlist.datetime.timestamp()
    } for playlist in Playlist.objects.filter(show__dj=dj)], key=lambda x: x['id'], reverse=True)   

    # dj_charts = charts(Spin.objects.filter(playlist__show__dj=dj))

    context = {
        'props' : {'title': dj.name, 'djId': dj_id, 'playlists': playlists, 'userinfo': userinfo},
        'bundle': 'explore-dj',
        'title' : 'Explore DJs: %s' % dj.name
    }

    return render(request, "component.html", context=context)


def explore_playlist(request, playlist_id):
    """ Render the explore page for a particular playlist.
    """
    userinfo = get_user_details(request)

    playlist = get_object_or_404(Playlist, pk=playlist_id)

    # Get playlist details
    showdetails = {
        'id'        : playlist_id,
        'title'     : playlist.show.name,
        'subtitle'  : playlist.subtitle,
        'dj'        : [dj.name for dj in playlist.show.dj.all()],
        'genre'     : playlist.genre.name if playlist.genre else None,
        'subgenre'  : [g.name for g in playlist.subgenre.all()],
        'desc'      : playlist.desc,
        'datetime'  : playlist.datetime.timestamp(),
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
        'props' : {'spins': spins, 'show': showdetails, 'comments': comments, 'userinfo': userinfo},
        'bundle': 'explore-playlist',
        'title' : 'Explore Playlists: %s' % (showdetails['title'])
    }

    return render(request, "component.html", context=context)

def explore_landing(request):
    """ the main landing page for the whole darn site
    """

    userinfo = get_user_details(request)

    n_recent = 20

    playlists = [{
        'id'        : playlist.id,
        'title'     : playlist.show.name,
        'dj'        : playlist.show.dj.all().first().name,
        'djId'      : playlist.show.dj.all().first().id,
        'subtitle'  : playlist.subtitle,
        'date'      : playlist.datetime.timestamp()
    } for playlist in Playlist.objects.all().order_by('-id')[:n_recent]]

    context = {
        'props' : {'userinfo': userinfo, 'playlists': playlists},
        'bundle': 'explore-landing',
        'title' : 'WPRB 103.3FM: Explore Music and Playlists'
    }

    return render(request, "component.html", context=context)
