"""
Charts services
"""
from django.core.cache import cache
from django.http import JsonResponse
from playlist.models import DJ, Playlist, Spin
from timeit import default_timer as timer


from datetime import datetime
import json

def charts(request):
    """ Return the charts for a given query, filtering by DJ and timestamp if provided
    """
    queryset = Spin.objects.all()

    try: dj = int(request.GET['dj'])
    except (TypeError, ValueError) as e:
        dj = 0
    try: after = int(request.GET['after'])
    except (TypeError, ValueError):
        after = 0

    # Cache by dj and timestamp to the nearest day
    key = '%d-%d' % (dj, after // 24*60*60)
    charts = cache.get(key)
    if charts is None:
        # Filter by DJ
        if dj:
            dj = DJ.objects.get(pk=dj)
            queryset = queryset.filter(playlist__show__dj=dj)

        # Filter by timestamp
        if after:        
            queryset = queryset.filter(
                playlist__datetime__gte=datetime.fromtimestamp(int(request.GET['after'])))

        # Compute charts
        charts = charts_from_queryset(queryset)

        # Cache result
        cache.set(key, charts, None)

    return JsonResponse(charts)

def charts_from_queryset(queryset):
    """ Return the top albums, artists, and songs from a queryset.
    """

    total = queryset.count()
    # Build a list of all the artists
    artists = {}
    albums = {}
    songs = {}
    labels = {}
    for i,spin in enumerate(queryset):
        print('%.2f%%\r' % (100*i/total), end='')
        #Add each artist to the running dictionary
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
            songs[spin.song] += 1
        else:
            songs[spin.song] = 1

        if spin.song.album.label in labels:
            labels[spin.song.album.label] += 1
        elif spin.song.album.label is not None:
            labels[spin.song.album.label] = 1

    charts = {
        'artist' : [
                {'name': a.name, 'id': a.id, 'plays': artists[a]} 
                for a in sorted(artists, key=lambda x: artists[x], reverse=True)[:30]
            ],
        'album'  : [
                {'name': a.name, 'id': a.id, 'plays': albums[a]} 
                for a in sorted(albums, key=lambda x: albums[x], reverse=True)[:30]
            ],
        'song'   : [
                {'name': s.name, 'id': s.id, 'plays': songs[s]} 
                for s in sorted(songs, key=lambda x: songs[x], reverse=True)[:30]
            ],
        'label'  : [
                {'name': l.name, 'id': l.id, 'plays': labels[l]} 
                for l in sorted(labels, key=lambda x: labels[x], reverse=True)[:30]
            ],
    }

    return charts