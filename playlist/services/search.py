from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.http import QueryDict, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from ..models import Spin, Playlist, DJ, Show
from ..util import invalid_array_index, error, success, spin_to_dict
from music.models import Song, Artist, Album, Label, Genre, Subgenre
from music.common import get_or_create

import json

# An API for the search bar. Returns query matches across songs, artists,
# albums, djs, shows, and labels.

@require_http_methods(["GET"])
def search(request):
    """ Request contains 'title' and uri contains playlist_id
        Sets the title of playlist_id to 'title'
    """

    # only return this amount of matches per category. Arbitrarily decided
    cutoff = 5

    # return matches by sorted by decreasing order of playcount
    try:
        query = request.GET['query']
        song_matches = Song.objects.filter(name__icontains=query).order_by('-playcount')
        artist_matches = Artist.objects.filter(name__icontains=query).order_by('-playcount')
        album_matches = Album.objects.filter(name__icontains=query).order_by('-playcount')
        dj_matches = DJ.objects.filter(name__icontains=query)
        show_matches = Show.objects.filter(name__icontains=query)
        label_matches = Label.objects.filter(name__icontains=query)
    except:
        return error('database error')

    # prepare the response for the search bar component
    response = {
        "songs"     : [{'name': s.name, 'id': s.id} for s in song_matches[:cutoff]],
        "artists"   : [{'name': a.name, 'id': a.id} for a in artist_matches[:cutoff]],
        "albums"    : [{'name': a.name, 'id': a.id} for a in album_matches[:cutoff]],
        "djs"       : [{'name': d.name, 'id': d.id} for d in dj_matches[:cutoff]],
        # small hack. We don't actually have a show explore page, so we redirect
        # a search for a show to the corresponding dj's page
        "shows"     : [{'name': s.name, 'id': s.dj.all().first().id} for s in show_matches[:cutoff]],
        "labels"    : [{'name': l.name, 'id': l.id} for l in label_matches[:cutoff]]
    }

    return JsonResponse(response)
