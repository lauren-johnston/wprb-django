from django.contrib import admin

from .models import Spin, Playlist, DJ, Show, Settings

# Register your models here.
admin.site.register(Spin)
admin.site.register(Playlist)
admin.site.register(DJ)
admin.site.register(Show)
admin.site.register(Settings)