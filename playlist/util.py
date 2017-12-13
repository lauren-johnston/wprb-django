"""
A location for helper functions.
"""
from django.http import JsonResponse

def date_to_str(date):
    """ Convert a date object to a string mm/dd/yy
    """
    return '%d/%d/%s' % (date.month, date.day, str(date.year)[-2:])

def error(message):
	return JsonResponse({
		'ok': False,
		'error': message
		})

def success():
	return JsonResponse({'ok': True})

def invalid_array_index(array, index):
	if (index is None) or (index < 0) or (index > len(array)):
		return True
	return False

def spin_to_dict(spin):
	return {
		"id": spin.id,
		"spindex": spin.index,
		"title": spin.song.name,
		"artist": spin.song.artist.all()[0].name,
		"album": spin.song.album.name,
		"label": spin.song.album.label
	}