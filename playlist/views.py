from django.shortcuts import render

from .models import *


def edit(request):
	""" Serve the page for editing a single playlist.
	"""

	spins = [{
		'title'	: 'Track %d' % i,
		'artist': ['Artist %d' % i],
		'album'	: 'Album %d' % i
	} for i in range(10)]

	show = {
		'title'  	: 'A Cool Show',
		'subtitle'	: 'with a subtitle',
		'dj'		: ['One DJ', 'And Another'],
		'genre'		: 'The Main genre',
		'subgenre'	: ['A mike genre', 'shit-slop funk bass', 'another mike genre'],
		'desc'		: 'Here you can talk about this episode of your show. Anything in particular you want to say?'
	}

	return render(request, "edit.html", context={'spins': spins, 'show': show})