"""
Here lies the database schema for music.

The database maintains musical information, relating songs, albums, and
artists, as well as play data, relating shows, djs, and playlists, to the
music being played.
"""

from django.db import models

#******************************************************************************
# Song Information
#******************************************************************************

class Artist(models.Model):
	""" An artist, with a name, and some things.
	"""
	name = models.CharField(max_length=100)

	genre = models.ManyToManyField('Genre')
	subgenre = models.ManyToManyField('Subgenre')
	info = models.CharField(max_length=1500, blank=True)

	playcount = models.IntegerField()

class Song(models.Model):
	""" A song, with a name, and many other things
	"""
	name = models.CharField(max_length=100)
	info = models.CharField(max_length=1500, blank=True)

	artist = models.ManyToManyField('Artist')
	album = models.ForeignKey('Album', on_delete=models.PROTECT)
	genre = models.ManyToManyField('Genre')
	subgenre = models.ManyToManyField('Subgenre')

	playcount = models.IntegerField()

class Album(models.Model):
	""" An album, which has a name, and was released in a year on a label.
	"""
	name = models.CharField(max_length=100)
	year = models.IntegerField(default=0)
	info = models.CharField(max_length=1500, blank=True)

	label = models.ForeignKey('Label', on_delete=models.PROTECT)
	artist = models.ForeignKey('Artist', on_delete=models.PROTECT)

	playcount = models.IntegerField()

class Label(models.Model):
	""" A record label, which has a name and maybe a location.
	"""
	name = models.CharField(max_length=100)

class Genre(models.Model):
	""" A Musical genre.  The list of available genres is only editable by an admin.
	"""
	name = models.CharField(max_length=100)

class Subgenre(models.Model):
	""" A Musical genre.  The list of available genres is only editable by an admin.
	"""
	name = models.CharField(max_length=100)

	# Users can own and create subgenre tags
	author = models.ForeignKey('auth.User', blank=True, null=True, on_delete=models.SET_NULL)

