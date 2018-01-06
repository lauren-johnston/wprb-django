"""
Parse the old database stored in wprb.json and add the entries to our database
"""
if __name__=='__main__':
	import os, django
	os.environ['DJANGO_SETTINGS_MODULE'] = 'radio.settings'
	django.setup()

from datetime import date, datetime
import json

from playlist.models import *
from music.models import *
from music.common import get_or_create

def progress_bar(count, total, size=50):
	filled = int(size*count/total)
	bar = ("#" * filled) + (" " * (size-filled))
	print(' [%s] %.2f%% complete\r' % (bar, 100*(count/total)), end='')

def add_djs(djs, logins):
	""" Iterate through a list of DJ objects and add them to the database
	along with their show
	"""
	for djid, entry in djs.items():
		if not entry['defdjname']: continue
		if User.objects.filter(username=logins[entry['loginsID']]['login']).exists(): continue
		# create user object
		usr = User.objects.create_user(
			username=logins[entry['loginsID']]['login'], 
			password='default')

		# Create dj object
		print('Creating DJ %d: %s' % (int(entry['ID']), entry['defdjname']))
		dj = DJ(
			name=entry['defdjname'], 
			user=usr,
			first_name=entry['firstname'],
			last_name=entry['lastname'])

		dj.id = int(entry['ID'])
		dj.save()

		# Create "show" object
		print('Creating Show %s' % entry['deftitle'])
		show = Show(name=(entry['deftitle'] if entry['deftitle'] else entry['defgenre']))
		show.save()
		show.dj.add(dj)


def add_playlists(playlists):
	""" Iterate through a list of playlist objects (from old WPRB db) 
	and create each one in the new database
	"""
	count = 0
	total = len(playlists)

	for pid, playlistdata in playlists.items():
		# keep count
		progress_bar(count, total)
		count += 1

		# Get playlist and show
		try: dj = DJ.objects.get(pk=int(playlistdata['userID']))
		except DJ.DoesNotExist: continue 

		show = Show.objects.filter(dj=dj).first()

		genre, created = Genre.objects.get_or_create(name=playlistdata['genre'])

		# convert unix epoch timestamp to time of day
		# hour = (int(playlistdata['starttime']) % 86400) // 3600
		# minute = int(playlistdata['starttime']) % 60
		# time = '%02d:%02d' % (hour, minute)

		# Create playlist object
		playlist = Playlist(
			show=show, 
			datetime=datetime.fromtimestamp(int(playlistdata['starttime'])),
			subtitle=playlistdata['subtitle'],
			genre=genre,
			timestamp=datetime.now(),
			length=playlistdata['duration'],
		)

		playlist.id = int(pid)
		playlist.save()

def add_spins(spins, min_id=0):
	""" Iterate through a list of spins and add them to the proper playlist
	"""
	count = 0
	total = len(spins)

	for spin_id, spin in spins.items():
		# keep count
		progress_bar(count, total)
		count += 1
		if int(spin_id) < min_id: continue

		# attempt to salvage classical
		if spin['album'] is None: spin['album'] = spin['ensemble']

		# skip breaks
		if spin['song'] == "BREAK" or not all((spin['album'],spin['song'],spin['artist'])): continue

		# find stuff
		artist, album, song, _ = get_or_create(spin['artist'], spin['album'], spin['song'], spin['label'])
		try: playlist = Playlist.objects.get(pk=int(spin['showID']))
		except Playlist.DoesNotExist: continue

		artist.playcount += 1
		album.playcount += 1
		song.playcount += 1
		artist.save()
		album.save()
		song.save()
		
		index = Spin.objects.filter(playlist=playlist).count() + 1
		spin = Spin(song=song, playlist=playlist, index=index)
		spin.save()


def main(filename, min_id=0):
	print('loading file...', end='')
	with open(filename) as file:
		db = json.load(file)
	print('done!')

	if 'users' in db and 'logins' in db:
		print('\nadding users\n')
		add_djs(db['users'], db['logins'])
	if 'shows' in db:
		print('\nadding shows\n')
		add_playlists(db['shows'])
	if 'playlist' in db:
		print('\nadding spins\n')
		add_spins(db['playlist'], min_id)

if __name__=="__main__":
	import sys
	if len(sys.argv) not in [2,3]:
		print('usage: python populate.py <filename> <min_id>?')
		sys.exit(1)

	if len(sys.arv) == 3:
		main(sys.argv[1], int(sys.argv[2]))
	else:
		main(sys.argv[1])

