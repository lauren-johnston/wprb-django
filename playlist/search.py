""" search.py - Implements basic services for searching. """

def complete(**kwargs):
	""" Returns a list of songs that *match* the provided
	    title, artist, album, and label, which can all be 
		incomplete strings. 
	"""

	# Filter songs by query, case insensitively
	songs = Songs.objects.all()
	if 'title' in kwargs:
		songs = songs.filter(name__icontains=args['title'])
	if 'artist' in kwargs:
		songs = songs.filter(artist__name__icontains=args['artist'])
	if 'album' in kwargs:
		songs = songs.filter(album__name__icontains=args['album'])
	if 'label' in kwargs:
		songs = songs.filter(album__label__name__icontains=args['label'])

	matches = [
		{
			'title'	: s.name,
			'artist': s.artist.name,
			'album' : s.album.name,
			'label' : s.album.label.name if album.label else None,
		} for s in songs
	]

	return matches
