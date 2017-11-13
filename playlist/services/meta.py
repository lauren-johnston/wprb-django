#!/usr/bin/env python
''' meta.py
	Implements server side API for meta-playlist operations.
'''
from django.views.decorators.http import require_http_methods

@require_http_methods(["PUT"])
def title(request, playlist_id):
	''' Updates the title of the specified playlist.'''
	pass

@require_http_methods(["PUT"])
def desc(request, playlist_id):
	''' Updates the description of the specified playlist.'''
	pass

@require_http_methods(["PUT"])
def genre(request, playlist_id):
	''' Updates the genre of the specified playlist.'''
	pass

@require_http_methods(["POST", "DELETE"])
def subgenre(request, playlist_id):
	''' Updates the subgenre of the specified playlist.'''
	pass