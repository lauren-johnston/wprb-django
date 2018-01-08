"""
Charts services
"""

from django.http import JsonResponse
from playlist.models import DJ, Playlist, Spin

import json

def charts(request):
    """ Return the charts for a given query, filtering by DJ and timestamp if provided
    """

    queryset = Spin.objects.all()

    # Filter by DJ
    try: 
        dj = int(DJ.objects.get(pk=request.GET['dj']))
        queryset = queryset.filter(playlist__show__dj=dj)
    except (TypeError, ValueError):
        pass

    # Filter by timestamp
    try:       
        queryset = queryset.filter(
            playlist__datetime__gte=int(request.GET['after']))
    except (TypeError, ValueError):
        pass

    # Compute charts
    charts = charts_from_queryset(queryset)

    return JsonResponse(charts)

def charts_from_queryset(queryset):
    """ Return the top albums, artists, and songs from a queryset.
    """

    # Build a list of all the artists
    artists = {}
    albums = {}
    songs = {}
    labels = {}
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