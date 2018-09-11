if __name__=='__main__':
    import os, django
    os.environ['DJANGO_SETTINGS_MODULE'] = 'radio.settings'
    django.setup()

from datetime import date, datetime
import json

from playlist.models import *
from music.models import *
from music.common import get_or_create

usr = User()
