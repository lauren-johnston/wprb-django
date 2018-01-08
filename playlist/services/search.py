from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.http import QueryDict, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from ..models import Spin, Playlist, DJ, Show
from ..util import invalid_array_index, error, success, spin_to_dict
from music.models import Song, Artist, Album, Label, Genre, Subgenre
from music.common import get_or_create

import json

@require_http_methods(["GET"])
def search(request):
    """ Request contains 'title' and uri contains playlist_id
        Sets the title of playlist_id to 'title'
    """
    cutoff = 5
    try:
        query = request.GET['query']
        song_matches = Song.objects.filter(name__icontains=query)
        artist_matches = Artist.objects.filter(name__icontains=query)
        album_matches = Album.objects.filter(name__icontains=query)
        dj_matches = DJ.objects.filter(name__icontains=query)
        show_matches = Show.objects.filter(name__icontains=query)
        label_matches = Label.objects.filter(name__icontains=query)
    except:
        return error('database error')


    response = {
        "songs"     : [{'name': s.name, 'id': s.id} for s in sorted(song_matches, key=lambda x: x.playcount, reverse=True)[:cutoff]],
        "artists"   : [{'name': a.name, 'id': a.id} for a in sorted(artist_matches, key=lambda x: x.playcount, reverse=True)[:cutoff]],
        "albums"    : [{'name': a.name, 'id': a.id} for a in sorted(album_matches, key=lambda x: x.playcount, reverse=True)[:cutoff]],
        "djs"       : [{'name': d.name, 'id': d.id} for d in dj_matches[:cutoff]],
        "shows"     : [{'name': s.name, 'id': s.dj.all().first().id} for s in show_matches[:cutoff]],
        "labels"    : [{'name': l.name, 'id': l.id} for l in label_matches[:cutoff]]
    }

    return JsonResponse(response)
