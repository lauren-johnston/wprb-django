from django.contrib import admin

from .models import Artist, Song, Album, Label, Genre, Subgenre

# Register your models here.
admin.site.register(Artist)
admin.site.register(Song)
admin.site.register(Album)
admin.site.register(Label)
admin.site.register(Genre)
admin.site.register(Subgenre)