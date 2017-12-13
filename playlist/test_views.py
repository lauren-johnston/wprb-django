from django.shortcuts import render, get_object_or_404, redirect

from .models import *
from .util import *

def graph(request):
	""" This function will render the graph component.
	"""

	# Do any computation you need here to build the props dictionary
	props = {}

	context = {
		'props' : props,
		'bundle': 'graph'
	}

	return render(request, "component.html", context=context)

def search(request):
	""" This function will render the search component.
	"""

	# Do any computation you need here to build the props dictionary
	props = {}

	context = {
		'props' : props,
		'bundle': 'search'
	}

	return render(request, "component.html", context=context)


def details(request):
	""" This function will render the details component.
	"""

	# Do any computation you need here to build the props dictionary
	props = {}

	context = {
		'props' : props,
		'bundle': 'details'
	}

	return render(request, "component.html", context=context)

def shows(request):
	""" This function will render the playlistSSSSSSSS component.
	"""

	# Do any computation you need here to build the props dictionary
	props = {}

	context = {
		'props' : props,
		'bundle': 'shows'
	}

	return render(request, "component.html", context=context)


def chart(request):
	""" This function will render the graph component.
	"""

	# Do any computation you need here to build the props dictionary
	props = {}

	context = {
		'props' : props,
		'bundle': 'chart'
	}

	return render(request, "component.html", context=context)

