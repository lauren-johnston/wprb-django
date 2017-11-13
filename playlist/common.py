"""
A location for helper functions.
"""
from Django.http import JsonResponse

def errorJson(message):
	return JsonResponse({'error': message})