from django.test import TestCase

class PlaylistModelTests(TestCase):

	def entry_api_basic_functionality(self):
		''' Test the basic functionality of the entry api. '''

		# Make a test object and save it to the database
		Playlist(desc="__testing__").save()

		# Retrieve the object from the database with the new metadata attached
		plist = Playlist.objects.filter(desc="__testing__").first()

		# Do some stuff with plist and the entry api, e.g....
		entry.add(plist.id, someTitle, someAuthor, someAlbum, someLabel, somePosition)
		# and then use asserts to validate what you did...
		self.assertIs(plist.some_length_method(), 1)
		# and so on...

		# and at the end, delete our test object
		Playlist.objects.filter(desc="__testing__").delete()

	def meta_api_basic_functionality(self):
		''' Test the basic functionality of the meta api. '''
		# See above
		Playlist(desc="__testing__").save()
		plist = Playlist.objects.filter(desc="__testing__").first()

		meta.title(plist.id, someTitle)
		self.assertIs(plist.some_title_method(), someTitle)
		# and so on...

		#At the end, delete our test object
		Playlist.objects.filter(desc="__testing__").delete()
		
