""" meta.py
	Implements server side API for meta-playlist operations.
"""
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.http import QueryDict, HttpResponse, JsonResponse

from ..models import Playlist
from music.models import Genre, Subgenre
from ..common import *

@login_required
@require_http_methods(["PUT"])
def subtitle(request, playlist_id):
	""" Request contains 'title' and uri contains playlist_id
	    Sets the title of playlist_id to 'title'
	"""
	try: 
		args = QueryDict(request.body)
		playlist = Playlist.objects.get(pk=playlist_id)
		playlist.subtitle = args['title']
	except Playlist.DoesNotExist:
		return error('Invalid playlist id')
	except KeyError:
		return error('Query does not contain required arguments')

	playlist.save()
	return success()

@login_required
@require_http_methods(["PUT"])
def desc(request, playlist_id):
	""" Request contains 'desc' and uri contains playlist_id
	    Sets the desc of playlist_id to 'desc'
	"""
	try: 
		args = QueryDict(request.body)
		playlist = Playlist.objects.get(pk=playlist_id)
		playlist.desc = args['desc']
	except Playlist.DoesNotExist:
		return error('Invalid playlist id')
	except KeyError:
		return error('Query does not contain required arguments')

	playlist.save()
	return success()

@login_required
@require_http_methods(["PUT"])
def genre(request, playlist_id):
	""" Request contains 'genre' and uri contains playlist_id
	    Sets the genre of playlist_id to 'genre'
	"""
	try:
		args = QueryDict(request.body)
		playlist = Playlist.objects.get(pk=playlist_id)
		genre = Genre.objects.get(name__iexact=args['genre'])
		playlist.genre_set.add(genre)
	# If no playlist...
	except Playlist.DoesNotExist:
		return error('Invalid playlist id')
	# If dict doesn't have proper arguments...
	except KeyError:
		return error('Query does not contain required arguments')
	# If no genre match...
	except Genre.DoesNotExist:
		playlist.genre_set.create(name=args['genre'])

	playlist.save()
	return success()

@login_required
@require_http_methods(["POST"])
def add_subgenre(request, playlist_id):
	""" Request contains 'subgenre' and uri contains playlist_id
	    POST: Adds the subgenre 'subgenre' to playlist_id 
	    DELETE: Removes the subgenre 'subgenre' from playlist_id
	"""
	try: 
		args     = QueryDict(request.body)
		playlist = Playlist.objects.get(pk=playlist_id)
		subgenre = Subgenre.objects.get(name__iexact=args['subgenre'])
	except Playlist.DoesNotExist:
		return error('Invalid playlist id')
	except KeyError:
		return error('Query does not contain required arguments')
	except Subgenre.DoesNotExist:
		playlist.subgenre_set.create(name=args['subgenre'], author=request.user)
		playlist.save()
		return success()

	if not (playlist.subgenre_set.filter(pk=subgenre.pk).exists()):
		playlist.subgenre_set.add(subgenre)
		playlist.save()

	return success()

@login_required
@require_http_methods(["DELETE"])
def del_subgenre(request, playlist_id):
	""" Request contains 'subgenre' and uri contains playlist_id
	    POST: Adds the subgenre 'subgenre' to playlist_id 
	    DELETE: Removes the subgenre 'subgenre' from playlist_id
	"""
	try: 
		args     = QueryDict(request.body)
		playlist = Playlist.objects.get(pk=playlist_id)
		subgenre = Subgenre.objects.get(name__iexact=args['subgenre'])
	except Playlist.DoesNotExist:
		return error('Invalid playlist id')
	except KeyError:
		return error('Query does not contain required arguments')
	except Subgenre.DoesNotExist: 
		return success()

	matching_contents = playlist.subgenre_set.filter(pk=subgenre.pk)
	if (matching_contents.exists()):
		matching_contents.delete()

	return success()