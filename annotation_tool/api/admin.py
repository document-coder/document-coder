from django.contrib import admin
from api import models

admin.site.register(models.KVStore)
admin.site.register(models.Assignment)
admin.site.register(models.Coding)
admin.site.register(models.Project)
admin.site.register(models.CodingInstance)
admin.site.register(models.Policy)
admin.site.register(models.ProjectRole)
admin.site.register(models.PolicyInstance)
admin.site.register(models.TimingSession)
