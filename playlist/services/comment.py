"""
Services pertaining to playlist comments.

Add, update, and delete comments on playlists.
"""
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt

from django.http import QueryDict, JsonResponse

from ..models import Spin, Comment, Playlist
import json, time, datetime

@csrf_exempt
@require_http_methods(['POST'])
def new(request, playlist_id):
    """ Add a comment to the specified playlist.
    """

    # Check that specified playlist exists
    try: 
        playlist = Playlist.objects.get(pk=playlist_id)
    except Playlist.DoesNotExist: 
        return JsonResponse({'error' : 'Specified playlist does not exist' })

    # HACK
    args = json.loads(request.body.decode('utf-8'))

    # Get text and instantiate comment
    text = args['text']

    print(text)
    comment = Comment(text=text, playlist=playlist)

    # Associate the proper entry if applicable
    if 'entryId' in request.POST:
        entry_id = int(request.POST['entryId'])
        if Spin.objects.filter(pk=entry_id).exists():
            comment.spin = Spin.objects.get(pk=entry_id)

    # Associate user with comment if applicable
    print(request.user)
    if not request.user.is_anonymous():
        comment.author = request.user

    comment.save()

    response = {
        'id'        : comment.id,
        'text'      : comment.text,
        'timestamp' : time.mktime(comment.timestamp.timetuple()),
        'author'    : comment.author.username if comment.author else 'anonymous'
    }
    print(response)

    return JsonResponse(response)

@login_required
@require_http_methods(['PUT'])
def edit(request, playlist_id):
    """ Update the text of a given comment.

    """
    args = QueryDict(request.body)
    comment_id = int(args['commentId'])
    comment = Comment.objects.get(pk=comment_id)

    # Validate request
    if not Playlist.objects.filter(pk=playlist_id).exists():
        return JsonResponse({'error' : 'Specified playlist does not exist'})
    if request.user.id != comment.author.id:
        return JsonResponse({'error' : 'Cannot update a comment by another user'})
    if 'text' not in args:
        return JsonResponse({'error' : 'Must specify text to update'})

    # Do the update
    comment.text = args['text']
    comment.save()

    return JsonResponse({'newText' : new_text})

@login_required
@require_http_methods(['DELETE'])
def delete(request, playlist_id):
    """ Delete the comment specified in the entryId field of the request body.

    An author can delete their own comment, or any comment on a playlist
    that they own.
    """

    args = QueryDict(request.body)
    comment_id = int(args['commentId'])
    user_id = request.user.id

    # Get playlist and comment objects
    try:
        comment = Comment.objects.get(pk=comment_id)
        playlist = Playlist.objects.get(pk=playlist_id)
    except Comment.DoesNotExist:
        return JsonResponse({'error' : 'Specified comment does not exist'})
    except Playlist.DoesNotExist:
        return JsonResponse({'error' : 'Specified playlist does not exist'})

    # Check that user owns comment or playlist
    if not playlist.dj.filter(pk=user_id).exists() and user_id != comment.author.id:
        return JsonResponse({'error' : 'Cannot delete a comment by another user'})

    comment.delete()

    return JsonResponse({'success' : True})