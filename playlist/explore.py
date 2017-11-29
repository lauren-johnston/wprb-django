from django.shortcuts import render, get_object_or_404

from music.models import *
from .models import *

def date_to_str(date):
    """ Convert a date object to a string mm/dd/yy
    """
    return '%d/%d/%s' % (date.month, date.day, str(date.year)[-2:])

def plays(field, field_id, max=50):
    """ Return a list 

    """

    # Filter the spins on the appropriate query
    if field == 'artist':
        plays = Spin.objects.filter(song__artist__id=field_id)
    elif field == 'album':
        plays = Spin.objects.filter(song__album__id=field_id)
    elif field == 'dj':
        plays = Spin.objects.filter(playlist__show__dj=field_id)
    elif field == 'song':
        plays = Spin.objects.filter(song=field_id)
    elif field == 'playlist':
        plays = Spin.objects.filter(playlist=field_id)

    p = [{
        'artist'    : [{'name': a.name, 'id': a.id} for a in p.song.artist.all()],
        'song'      : p.song.name,
        'songId'    : p.song.id,
        'album'     : p.song.album.name,
        'albumId'   : p.song.album.id,
        'label'     : p.song.album.label.name if p.song.album.label else None,
        'labelId'   : p.song.album.label.id if p.song.album.label else None,
        'dj'        : [{'name': dj.name, 'id': dj.id} for dj in p.playlist.show.dj.all()],
        'date' : date_to_str(p.playlist.date),
        'playlistId': p.playlist.id,
    } for p in plays]

    print(p)

    return p

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