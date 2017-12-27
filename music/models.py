"""
Here lies the database schema for music.

The database maintains musical information, relating songs, albums, and
artists, as well as play data, relating shows, djs, and playlists, to the
music being played.
"""

from django.db import models
from datetime import datetime

#******************************************************************************
# Song Information
#******************************************************************************

class Artist(models.Model):
    """ An artist, with a name, and some things.
    """
    name = models.CharField(max_length=100)

    genre = models.ManyToManyField('Genre', blank=True)
    subgenre = models.ManyToManyField('Subgenre', blank=True)
    info = models.CharField(max_length=1500, blank=True)
 
    playcount = models.IntegerField(default=0, editable=False)

    def __str__(self):
        genres = ' & '.join([genre.name for genre in self.genre.all()])
        subgenres = ' & '.join([subgenre.name for subgenre in self.subgenre.all()])
        return 'Artist %d: Name: %s, Genre(s): %s, Subgenre(s): %s, Info: "%s..."' \
            % (self.id, self.name, genres, subgenres, self.info[:15])


class Song(models.Model):
    """ A song, with a name, and many other things
    """
    name = models.CharField(max_length=100)
    info = models.CharField(max_length=1500, blank=True)

    artist = models.ManyToManyField('Artist', blank=True)
    # TODO: Replace blank=True with a default value for "Unknown Album"
    album = models.ForeignKey('Album', on_delete=models.PROTECT, null=True, blank=True)
    genre = models.ManyToManyField('Genre', blank=True)
    subgenre = models.ManyToManyField('Subgenre', blank=True)

    playcount = models.IntegerField(default=0, editable=False)

    def __str__(self):
        artists = ' & '.join([artist.name for artist in self.artist.all()])
        return 'Song %d: %s by %s on %s' \
            % (self.id, self.name, artists, self.album.name)

class Album(models.Model):
    """ An album, which has a name, and was released in a year on a label.
    """
    name = models.CharField(max_length=100)
    year = models.IntegerField(default=datetime.now().year)
    info = models.CharField(max_length=1500, blank=True)

    # TODO: Replace blank=True with a default value for "Unknown Label"
    label = models.ForeignKey('Label', on_delete=models.PROTECT, null=True, blank=True)
    artist = models.ForeignKey('Artist', on_delete=models.PROTECT, null=True, blank=True)

    playcount = models.IntegerField(default=0, editable=False)

    def __str__(self):
        """ Right now albums only have one artist associated with them, eventually we
            need to add possibility for more. 
        """
        #artists = ' & '.join([artist.name for artist in self.artist.all()])
        return 'Album %d: Title: %s, Artist: %s, Year: %s, Info: "%s..."' \
            % (self.id, self.name, self.artist, self.year, self.info[:15])


class Label(models.Model):
    """ A record label, which has a name and maybe a location.
    """
    name = models.CharField(max_length=100)

    def __str__(self):
        return 'Label %d: Title: %s' \
            % (self.id, self.name)


class Genre(models.Model):
    """ A Musical genre.  The list of available genres is only editable by an admin.
    """
    name = models.CharField(max_length=100)

    def __str__(self):
        return 'Genre %d: Name: %s' \
            % (self.id, self.name)


class Subgenre(models.Model):
    """ A Musical genre.  The list of available genres is only editable by an admin.
    """
    name = models.CharField(max_length=100)

    # Users can own and create subgenre tags
    author = models.ForeignKey('auth.User', blank=True, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return 'Subgenre %d: Name: %s' \
            % (self.id, self.name)

