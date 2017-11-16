from django.db import models

# Commenting out these dummy functions for later implementation (?)
"""
def exploresong(songid):
    return "lol"

def exploreartist(artistid):
    return "thunderfunk"

def explorealbum(albumid):
    return "The Life of Pabloo00o0"

def explorelabels(labelid):
    return "The Ellen Degeneres Label"

def exploreDJ(DJid):
    return "MixMaster Paalindrome"

def exploreshow(showid):
    return "running this ish"
"""

def exploreplays(songid, limit):
    """
    An exploratory function to return a list of dictionaries of information 
    relevant to "songid", upper bounded by "limit". 
    The fields being returned are: 
    'showId', 'djId', 'showName', 'djName', 'timestamp'
    """

    # Initializing return list
    ret = []
    
    # Grabbing the song in question
    song = Song.objects.get(id=songid)
    
    # Grabbing the instances of playtlists that have spins of the song
    playlists = Playlists.objects.filter(spin__song=song)[:limit]
    
    # Iterating through, populating list with ddictionaries
    for playlist in playlists:

        # Some logistical hoop-jumping to allow for multiple spins
        # of same song in a particular playlist
        multiplespins = Spin.objects.filter(playlist=playlist, song=song)

        for spin in multiplespins
            entrydict = {
                'showId': playlist.show.id, 'showName': playlist.show.name, 
                'djId': playlist.show.dj.id, 'djName': playlist.show.dj.name, 
                'timestamp': spin.timestamp
            }
            ret.append(entrydict)
    
    return ret


def exploredetails(songid):
    """
    Returning a dictionary containing the information relevant to the queried
    songid. The dictionary contains the fields:
    'title', 'album', 'albumid', 'artist', 'artistid', 
    'genres', 'subgenres', 'plays'
    """

    # Caching the song associated with songid
    song = Song.objects.get(id=songid)
    
    # Populate the return dictionary
    ret = {
        'title'    : song.name, 
        'album'    : song.album.name,
        'albumid'  : song.album.id,
        'artist'   : song.artist.name, 
        'artistid' : song.artist.id,
        'genres'   : song.genre.name, 
        'subgenres': [subgenre.name for subgenre in song.subgenre.all()]
        'plays'    : song.playcount
    }

    return ret