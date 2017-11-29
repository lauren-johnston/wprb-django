"""
A location for helper functions.
"""
from django.http import JsonResponse

def date_to_str(date):
    """ Convert a date object to a string mm/dd/yy
    """
    return '%d/%d/%s' % (date.month, date.day, str(date.year)[-2:])

def error(message):
	return JsonResponse({'error': message})

def success():
	return JsonResponse({'success': True})

def invalid_array_index(array, index):
	if (index < 0) or (index >= len(array)):
		return True
	return False