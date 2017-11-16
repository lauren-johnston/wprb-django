"""
Here lies the database schema for playlists

Playlists relate music, as defined in the "music" app, to
DJs, who play the music at particular times.
"""

from django.db import models
from django.contrib.auth.models import User
from datetime import date

# Integer/string tuple representation of times of day
TIMES = [
    (int(i), '{}00'.format(i))
    for i in range(24)
]

# Character/string tuple representation of musical formats
FORMATS = (
    ('D', 'Digital'),
    ('V', 'Vinyl'),
    ('C', 'CD'),
    ('T', 'Cassette'),
    ('L', 'Live'),
    ('O', 'Other')
)

class Spin(models.Model):
    """ An instance of a single song being played; an entry in a playlist.
    """
    # The song that got played
    song = models.ForeignKey('music.Song')
    # Matt: What if we store the songID? That way we can do a lookup to
    # find all info included below. SongID provides easy querying into th3
    # big Song Database

    # potentially memoize title/artist/album/label to save joins?
    # title = models.CharField(max_length=100, blank=True)
    # artist = models.CharField(max_length=100, blank=True)
    # album = models.CharField(max_length=100, blank=True)
    # label = models.CharField(max_length=100, blank=True)

    # Where and when this spin lives in time
    timestamp = models.TimeField(auto_now_add=True)
    playlist = models.ForeignKey('Playlist')
    # Which number in the playlist is this?
    # unclear if this is the best approach, maybe a linked-list instead?
    index = models.IntegerField()

    # how did you spin it? sadly, "format" is a python reserved keyword...
    medium = models.CharField(max_length=1, blank=True, choices=FORMATS)

    def __str__():
        return ''' SPIN '''


class Playlist(models.Model):
    """ An ordered list of spins that happened at a particular time, by at least one DJ.
    """
    show = models.OneToOneField('Show')
    desc = models.CharField(max_length=250)
    subtitle = models.CharField(max_length=250, blank=True, null=True)

    # When did it happen ?
    time_start = models.CharField(max_length=4, choices=TIMES, blank=True)
    time_end = models.CharField(max_length=4, choices=TIMES, blank=True)
    date = models.DateField(default=date.today)

    # This playlist might have genres and subgenres different from the show in general
    genre = models.ForeignKey('music.Genre', blank=True, null=True)
    subgenre = models.ManyToManyField('music.Subgenre', blank=True)

    # When did it get added ?
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__():
        return ''' SPIN '''



class DJ(models.Model):
    """ A DJ plays the music, and must have identifying information
    """
    # One-to-one link to a Django "User" instance, for authentication purposes
    user = models.OneToOneField(User, null=True, on_delete=models.SET_NULL)

    # Identifying information for the DJ, real name and artist/DJ name

    # THIS IS THE DJ NAME
    name = models.CharField(max_length=100)
    # REMEMBER THIS IS THE DJ NAME

    first_name = models.CharField(max_length=40)
    last_name = models.CharField(max_length=40)

    # DJ may also have an email or website they want displayed
    email = models.EmailField(blank=True)
    display_email = models.BooleanField(default=True)
    website = models.URLField(blank=True)
    display_website = models.BooleanField(default=False)

    def __str__():
        return ''' SPIN '''


class Show(models.Model):
    """ A show is a recurring time slot on the radio, held by one or more DJs.

    Playlists usually belong to shows rather than DJs, but I'm not sure if 
    this abstraction is necessary.  It would be helpful if we wanted to 
    also incorporate the idea of a schedule into the app, or otherwise 
    allow for DJs to have distinct shows, but might not be worth the complexity.
    """
    name = models.CharField(max_length=100)
    dj = models.ManyToManyField('DJ')
    genre = models.ManyToManyField('music.Genre', blank=True)
    subgenre = models.ManyToManyField('music.Subgenre', blank=True)

    desc = models.CharField(max_length=1000, blank=True)

    def __str__():
        return ''' SPIN '''

class Comment(models.Model):
    """ A comment that is made on a playlist, or playlist entry.
    """

    text = models.CharField(max_length=500)
    author = models.OneToOneField(User, blank=True, null=True)
    playlist = models.ForeignKey('Playlist')
    spin = models.ForeignKey('Spin', blank=True, null=True)

    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__():
        return ''' SPIN '''

class Settings(models.Model):
    """ A collection of options that the DJ can set.

    Unsure exactly what these might be, but it could be useful to keep 
    track of some sort of DJ-specific behavior.  Examples could include
    customizing layout options/names (as classical DJs prefer different layouts)
    """
    # Whose settings are these ?
    owner = models.OneToOneField('DJ', blank=True, null=True)

    def __str__():
        return ''' SPIN '''
