from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from api import models

  # Project Admin
class ProjectAdmin(admin.ModelAdmin):
  list_display = ('name', 'prefix', 'id')
  fields = ('name', 'prefix')

  # Project Role Admin
class ProjectRoleAdmin(admin.ModelAdmin):
  list_display = ('project_name', 'user_email', 'is_owner', 'permissions')

  def permissions(self, obj):
    permissions = {k: v for k, v in obj.__dict__.items() if k.startswith("can_")}
    # return f"{sum(permissions.values())}/{len(permissions)}"
    return ''.join("✅" if v else "❌" for v in permissions.values())

  def project_name(self, obj):
    project = models.Project.objects.filter(id=obj.project).first()
    return project.name if project else str(obj.project)

  def formfield_for_dbfield(self, db_field, request, **kwargs):
    if db_field.name == "project":
      from django import forms
      projects = models.Project.objects.all()
      choices = [(None, "---")] + [(p.id, p.name) for p in projects]
      return forms.IntegerField(
        widget=forms.Select(choices=choices),
        required=True
      )
    return super().formfield_for_dbfield(db_field, request, **kwargs)

  # Custom User Admin
class CustomUserAdmin(UserAdmin):
  list_display = ('username', 'email', 'is_staff')
  fieldsets = (
    (None, {'fields': ('username', 'email', 'is_staff')}),
  )
  add_fieldsets = (
    (None, {
      'classes': ('wide',),
      'fields': ('username', 'email', 'is_staff', 'password1', 'password2'),
    }),
  )

# Register the models
admin.site.register(models.Project, ProjectAdmin)
admin.site.register(models.ProjectRole, ProjectRoleAdmin)

# Unregister default User admin and register custom one
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

# Unregister unused models
from allauth.socialaccount.models import SocialAccount, SocialApp, SocialToken, EmailAddress
admin.site.unregister(EmailAddress)
admin.site.unregister(SocialAccount)
admin.site.unregister(SocialApp)
admin.site.unregister(SocialToken)
from django.contrib.auth.models import Group
admin.site.unregister(Group)
from django.contrib.sites.models import Site
admin.site.unregister(Site)

# Customize admin site appearance
from django.contrib.auth.apps import AuthConfig
AuthConfig.verbose_name = "System-level user management"
admin.site.site_header = 'Project and User Management'
admin.site.index_title = 'Account Management'