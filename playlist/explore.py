from django.shortcuts import render, get_object_or_404

from music.models import *
from .models import *
from .util import date_to_str

def plays(field, field_id, max=50):
    """ Return a list of plays of a given resource of type field with id field_id.
        
        e.g. plays('artist', 1234) would return all the spins of songs by that artist,
        along with the song title/id, album title/id, label title/id, dj who played it,
        playlst id, and timestamp
    """

    # Filter the spins on the appropriate query
    if field == 'artist':
        plays = Spin.objects.filter(song__artist__id=field_id)
        title = Artist.objects.get(pk=field_id).name
    elif field == 'album':
        plays = Spin.objects.filter(song__album__id=field_id)
        title = Album.objects.get(pk=field_id).name
    elif field == 'song':
        plays = Spin.objects.filter(song=field_id)
        title = Song.objects.get(pk=field_id).name
    elif field == 'label':
        plays = Spin.objects.filter(song__album__label__id=field_id)
        title = Label.objects.get(pk=field_id).name
    else:
        raise RuntimeError('Invalid field name')

    p = [{
        'artist'    : p.song.artist.all()[0].name, #[{'name': a.name, 'id': a.id} for a in p.song.artist.all()],
        'artistId'  : p.song.artist.all()[0].id,
        'song'      : p.song.name,
        'songId'    : p.song.id,
        'album'     : p.song.album.name,
        'albumId'   : p.song.album.id,
        'label'     : p.song.album.label.name if p.song.album.label else None,
        'labelId'   : p.song.album.label.id if p.song.album.label else None,
        'dj'        : [{'name': dj.name, 'id': dj.id} for dj in p.playlist.show.dj.all()],
        'datetime'  : p.playlist.datetime.timestamp(),
        'playlistId': p.playlist.id,
    } for p in plays]

    return p, title

def charts(queryset):
    """ Return the top albums, artists, and songs from a queryset.
    """

    # Build a list of all the artists
    artists = {}
    albums = {}
    songs = {}
    for spin in queryset:
        # Add each artist to the running dictionary
        for a in spin.song.artist.all():
            if a in artists:
                artists[a] += 1
            else:
                artists[a] = 1

        if spin.song.album in albums:
            albums[spin.song.album] += 1
        else:
            albums[spin.song.album] = 1

        if spin.song in songs:
            albums[spin.song] += 1
        else:
            albums[spin.song] = 1

    charts = {
        'artists' : [
                {'name': a.name, 'id': a.id} 
                for a in sorted(artists, key=lambda x: artists[x])[:30]
            ],
        'albums'  : [
                {'name': a.name, 'id': a.id} 
                for a in sorted(albums, key=lambda x: albums[x])[:30]
            ],
        'songs'   : [
                {'name': s.name, 'id': s.id} 
                for s in sorted(songs, key=lambda x: songs[x])[:30]
            ],
    }

def details(field, id):
    """ Return the details associated with a given resource    
    """

    # Caching the song associated with songid
    song = Song.objects.get(id=songid)
    
    # Populate the return dictionary
    ret = {
        'title'    : song.name, 
        'album'    : song.album.name,
        'albumid'  : song.album.id,
        'artist'   : song.artist.name, 
        'artistid' : song.artist.id,
        'genres'   : song.genre.name, 
        'subgenres': [subgenre.name for subgenre in song.subgenre.all()],
        'plays'    : song.playcount
    }

    return ret