#!/usr/bin/env python
"""
A module to initialize a specific test database that we can
use to make sure our basic functionality is happening.
"""

# Hacky way of running a script in our django context
if __name__=='__main__':
	import os, django
	os.environ['DJANGO_SETTINGS_MODULE'] = 'radio.settings'
	django.setup()

from playlist.models import *
from music.models import *
from music.common import get_or_create

from django.contrib.auth.models import User
from django.core.management import execute_from_command_line

TEST_SONGS = [
	{
		'title' : 'Get Schwifty',
		'artist': 'Rick Sanchez',
		'album' : 'SHOW ME WHAT U GOT'
	},
	{
		'title' : 'The Rick Dance',
		'artist': 'Rick Sanchez',
		'album' : 'Riggity Riggity Rekt'
	},
	{
		'title' : 'Goodbye Moonman',
		'artist': 'Morty Smith',
		'album' : 'Hanging with Michael'
	},
]

def main():
	""" Initialize each of the database entries we want.
	"""

	# # Flush the database first
	# print('Flushing database')
	# execute_from_command_line('flush')

	print('Adding user jerrysmith')
	test_user = User.objects.create_user(
		username='jerrysmith',
		password='plutoisaplanet',
		email='jerrysmith@earthradio.com',
		is_superuser=True,
		is_staff=True
	)

	print('Making dj account for jerrysmith: "DJ Jerry"')
	test_dj = DJ(
		user=test_user, 
		name='DJ Jerry', 
		first_name='Jerry',
		last_name='Smith'
	)
	test_dj.save()

	print('Creating show "Earth Radio"')
	test_show = Show(
		name='Earth Radio',
		desc='hmm i like it'
	)
	test_show.save()

	print('Adding DJ Jerry as dj of "Earth Radio"')
	test_show.dj.add(test_dj)

	print('Creating a playlist on "Earth Radio"', end=' ')
	test_playlist = Playlist(
		show=test_show,
		subtitle='Human Music',
		desc='Just some music for humans',
	)
	test_playlist.save()
	print('(id=%d)' % test_playlist.id)

	# Add some songs and some spins to the playlist
	print('Adding songs to playlist...')
	for i, s in enumerate(TEST_SONGS):
		# Create artist if they don't exist
		_, _, song = get_or_create(s['artist'], s['album'], s['title'])
		print('\tAdding %s by %s' % (s['title'], s['artist']))
		spin = Spin(song=song, playlist=test_playlist, index=i+1)

		spin.save()

if __name__ == '__main__':
	main()