from django.test import TestCase, Client
from .services import entry, meta

class PlaylistModelTests(TestCase):

	def entry_api_basic_functionality(self):
		''' Test the basic functionality of the entry api. '''

		# Make a test object and save it to the database
		Playlist(desc="__testing__").save()

		# Retrieve the object from the database with the new metadata attached
		playlist = Playlist.objects.filter(desc="__testing__").first()
		url_base = '/playlist/' + playlist_id + '/entry/'

		# Do some stuff with plist and the entry api, e.g....
		client = Client()

		add_response = client.post(url_base + 'add', {'title':'test',
													  'artist':'test', 
													  'album':'test', 
													  'label':'test'})
		

		# and then use asserts to validate what you did...
		self.assertIs(playlist.some_length_method(), 1)
		# and so on...

		# and at the end, delete our test object
		Playlist.objects.filter(desc="__testing__").delete()

	def meta_api_basic_functionality(self):
		''' Test the basic functionality of the meta api. '''
		# See above
		Playlist(desc="__testing__").save()
		plist = Playlist.objects.filter(desc="__testing__").first()
		#MAKE A REQUEST OBJECT
		#Try it...
		meta.title()
		#Test it...
		self.assertIs(plist.some_title_method(), someTitle)
		# and so on...

		#At the end, delete our test object
		Playlist.objects.filter(desc="__testing__").delete()
		
