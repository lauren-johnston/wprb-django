from django import template
from django.utils.safestring import mark_safe
import bleach
import json as jsonlib

register = template.Library()

@register.filter
def json(value):
    """safe jsonify filter, bleaches the json string using the bleach html tag remover"""
    uncleaned = jsonlib.dumps(value)
    print('*' * 100)
    print('PRE CLEAN')
    print(uncleaned)
    print('*' * 100)
    clean = bleach.clean(uncleaned)
    print('*' * 100)
    print('POST CLEAN')
    print(clean)
    print('*' * 100)
    clean = clean.replace('&amp;', '&')
    print('*' * 100)
    print('POST REPLACEMENT')
    print(clean)
    print('*' * 100)
    clean = clean.replace('&lt;', '<')
    return mark_safe(clean)

@register.filter
def style(value):
	return value.split('-')[0]