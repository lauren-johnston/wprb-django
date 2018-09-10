"""
Here lies the database schema for playlists

Playlists relate music, as defined in the "music" app, to
DJs, who play the music at particular times.
"""

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator

from datetime import datetime

# Character/string tuple representation of musical formats
FORMATS = (
    ('D', 'Digital'),
    ('V', 'Vinyl'),
    ('C', 'CD'),
    ('T', 'Cassette'),
    ('L', 'Live'),
    ('O', 'Other')
)

def now_to_half_hour():
    """ Return the current time to the nearest half hour that has already passed.
    """
    now = datetime.now()
    rounded = 30 if now.minute >= 30 else 0

    return now.replace(microsecond=0, second=0, minute=rounded)


class Spin(models.Model):
    """ An instance of a single song being played; an entry in a playlist.
    """
    # The song that got played
    song = models.ForeignKey('music.Song')

    # potentially memoize title/artist/album/label to save joins?
    # title = models.CharField(max_length=100, blank=True)
    # artist = models.CharField(max_length=100, blank=True)
    # album = models.CharField(max_length=100, blank=True)
    # label = models.CharField(max_length=100, blank=True)

    # Where and when this spin lives in time
    timestamp = models.TimeField(auto_now_add=True)
    playlist = models.ForeignKey('Playlist')
    # Which number in the playlist is this?
    index = models.IntegerField(validators=[MinValueValidator(1)])

    # how did you spin it? sadly, "format" is a python reserved keyword...
    medium = models.CharField(max_length=1, blank=True, choices=FORMATS)

    def __str__(self):
        artists = ' & '.join([artist.name for artist in self.song.artist.all()])
        return 'Spin %d: \n\t Index: %d, \t Song: %s, \t Album: %s, \t Artist(s): %s' \
            % (self.id, self.index, self.song.name, self.song.album.name, artists)


class Playlist(models.Model):
    """ An ordered list of spins that happened at a particular time, by at least one DJ.
    """
    show = models.ForeignKey('Show')
    desc = models.CharField(max_length=250)
    subtitle = models.CharField(max_length=250, blank=True, null=True)

    # When did it happen ?
    datetime = models.DateTimeField(default=now_to_half_hour)
    length = models.FloatField(default=2)

    # This playlist might have genres and subgenres different from the show in general
    genre = models.ForeignKey('music.Genre', blank=True, null=True)
    subgenre = models.ManyToManyField('music.Subgenre', blank=True)

    # When did it get added ?
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        djs = ' & '.join([dj.name for dj in self.show.dj.all()])
        return 'Playlist %d: "%s" with %s' % (self.id, self.show.name, djs)


class DJ(models.Model):
    """ A DJ plays the music, and must have identifying information
    """
    # One-to-one link to a Django "User" instance, for authentication purposes
    user = models.OneToOneField(User, null=True, on_delete=models.SET_NULL)

    # Identifying information for the DJ, real name and artist/DJ name

    # THIS IS THE DJ NAME
    name = models.CharField(max_length=100)
    # Real people name
    first_name = models.CharField(max_length=40)
    last_name = models.CharField(max_length=40)

    # DJ may also have an email or website they want displayed
    email = models.EmailField(blank=True)
    display_email = models.BooleanField(default=True)
    website = models.URLField(blank=True)
    display_website = models.BooleanField(default=False)

    def __str__(self):
        return 'DJ %d: DJ Name: %s, Human Name: %s %s' \
            % (self.id, self.name, self.first_name, self.last_name)


class Show(models.Model):
    """ A show is a recurring time slot on the radio, held by one or more DJs.

    Playlists usually belong to shows rather than DJs, but I'm not sure if
    this abstraction is necessary.  It would be helpful if we wanted to
    also incorporate the idea of a schedule into the app, or otherwise
    allow for DJs to have distinct shows, but might not be worth the complexity.
    """
    name = models.CharField(max_length=100, default="Default Name")
    dj = models.ManyToManyField('DJ')
    genre = models.ManyToManyField('music.Genre', blank=True)
    subgenre = models.ManyToManyField('music.Subgenre', blank=True)

    desc = models.CharField(max_length=1000, blank=True)

    def __str__(self):
        djs = ' & '.join([dj.name for dj in self.dj.all()])
        return 'Show %d: Name: %s, DJ(s): %s, Desc: "%s..."' \
            % (self.id, self.name, djs, self.desc[:15])

class Comment(models.Model):
    """ A comment that is made on a playlist, or playlist entry.
    """

    text = models.CharField(max_length=500)
    author = models.ForeignKey(User, blank=True, null=True)
    playlist = models.ForeignKey('Playlist')
    spin = models.ForeignKey('Spin', blank=True, null=True)

    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return 'Comment %d: "%s..." by %s, on Playlist %s' \
            % (self.id, self.text[:15], self.author.username if self.author else 'anon', self.playlist.id)

class Settings(models.Model):
    """ A collection of options that the DJ can set.

    Unsure exactly what these might be, but it could be useful to keep
    track of some sort of DJ-specific behavior.  Examples could include
    customizing layout options/names (as classical DJs prefer different layouts)
    """
    # Whose settings are these ?
    owner = models.OneToOneField('DJ', blank=True, null=True)

    def __str__(self):
        return 'Settings %d: DJ: %s' % (self.id, self.dj.name)
