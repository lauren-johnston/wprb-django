"""
General, non-http services for the music app
"""

from .models import Artist, Album, Song, Label

def get_or_create(artist_name, album_name, song_title, label_name=''):
	""" Get the artist, album, and song objects corresponding to the string names
	of each, creating them if necessary.

	TODO: handle the case where there are multiple matches for artist
	"""

	artist = Artist.objects.filter(name__iexact=artist_name).first()
	if not artist: 
		artist = Artist(name=artist_name)
		artist.save()

	album = Album.objects.filter(name__iexact=album_name, artist=artist).first()
	if not album: 
		album = Album(name=album_name, artist=artist)
		album.save()

	if label_name != '':
		label, _ = Label.objects.get_or_create(name=label_name)
		album.label = label
		album.save()
	elif album.label == None:
		label = ''
	else:
		label = album.label

	song = Song.objects.filter(name__iexact=song_title, album=album, artist=artist).first()
	if not song: 
		song = Song(name=song_title, album=album)
		song.save()
		# Song must be saved before it can be associated with an artist
		song.artist.add(artist)
		song.save()

	return artist, album, song, label