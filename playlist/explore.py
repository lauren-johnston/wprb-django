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
        plays = Spin.objects.filter(song__label__id=field_id)
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
        'date'      : date_to_str(p.playlist.date),
        'playlistId': p.playlist.id,
    } for p in plays]

    return p, title

def shows(dj_id):
    """ Return a list of shows that have been played by the given dj
    """

    return None

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