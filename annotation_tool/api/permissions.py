# api/permissions.py
from api.util import get_project_id_from_request
from rest_framework import permissions
from api.models import Project, ProjectRole


class IsAdminUser(permissions.BasePermission):
  def has_permission(self, request, view):
    return request.user.is_authenticated and request.user.is_staff


class ProjectBasePermission(permissions.BasePermission):
  def _get_project_id(self, request):
    try:
      return get_project_id_from_request(request)
    except (KeyError, ValueError):
      self.message = "Invalid or missing project ID in request"
      return None

  def _get_user_role(self, user, project_id):
    return ProjectRole.objects.filter(
      user_email=user.email,
      project=project_id
    ).first()

  def has_permission(self, request, view):
    if not request.user.is_authenticated:
      self.message = "Authentication required"
      return False
    
    # Admins always have permission
    if request.user.is_staff:
      return True

    return self._check_project_permission(request, view)
    
  def _check_project_permission(self, request, view):
    # Subclasses should implement specific permission logic
    raise NotImplementedError()


class ProjectPermission(ProjectBasePermission):
  def _check_project_permission(self, request, view):   
    if request.method in permissions.SAFE_METHODS:
      return True
    return False

class IsProjectOwner(ProjectBasePermission):
  def _check_project_permission(self, request, view):
    project_id = self._get_project_id(request)
    if not project_id:
      return False
    role = self._get_user_role(request.user, project_id)
    return role and role.is_owner


class HasProjectPermission(ProjectBasePermission):
  def __init__(self, required_permission):
    self.required_permission = required_permission

  def _check_project_permission(self, request, view):
    project_id = self._get_project_id(request)
    if not project_id:
      return False
    role = self._get_user_role(request.user, project_id)
    return role and (
      role.is_owner or 
      getattr(role, self.required_permission, False)
    )


class ProjectPermissionMixin:
  def _get_project(self, request):
    project_id = get_project_id_from_request(request)
    if not project_id:
      return None
    return Project.objects.get(id=project_id)

  def _get_user_role(self, request):
    project = self._get_project(request)
    if project is None:
      return None
    try:
      return ProjectRole.objects.get(project=project.id, user_email=request.user.email)
    except ProjectRole.DoesNotExist:
      return None

  def has_permission(self, request, view):
    if not request.user.is_authenticated:
      return False
      
    # Admins always have permission
    if request.user.is_staff:
      return True

    role = self._get_user_role(request)
    if not role:
      return False

    if request.method in permissions.SAFE_METHODS:
      return self._has_read_permission(role)
    return self._has_write_permission(role)

  def has_object_permission(self, request, view, obj):
    return self.has_permission(request, view)

  def _has_read_permission(self, role):
    raise NotImplementedError()

  def _has_write_permission(self, role):
    raise NotImplementedError()


class ProjectRolePermission(ProjectPermissionMixin):
  def _has_read_permission(self, role):
    return True

  def _has_write_permission(self, role):
    print("CHEKCING PROJECT ROLE EDIT PERMISSION", role.is_owner)
    return role.is_owner

class SchemaPermission(ProjectPermissionMixin):
  def _has_read_permission(self, role):
    return role.can_view_schema

  def _has_write_permission(self, role):
    return role.is_owner or role.can_modify_schema


class ContentPermission(ProjectPermissionMixin):
  def _has_read_permission(self, role):
    return role.can_view_content

  def _has_write_permission(self, role):
    return role.is_owner or role.can_manage_content


class MetaContentPermission(ProjectPermissionMixin):
  def _has_read_permission(self, role):
    return role.can_view_content

  def _has_write_permission(self, role):
    return False


class AnnotationPermission(ProjectPermissionMixin):
  def _has_read_permission(self, role):
    return role.can_annotate or role.can_review

  def _has_write_permission(self, role):
    return role.can_annotate


class AssignmentPermission(ProjectPermissionMixin):
  def _has_read_permission(self, role):
    return True  # Everyone in project can see assignments exist
    
  def _has_write_permission(self, role):
    return role.is_owner or role.can_assign_tasks

  def has_object_permission(self, request, view, obj):
    # Admins can access all objects
    if request.user.is_staff:
      return True
      
    role = self._get_user_role(request)
    if not role:
      return False
      
    # Owners and reviewers can see all assignments
    if role.is_owner or role.can_review:
      return True
      
    # Others can only see their own assignments
    return obj.coder_email == request.user.email


class TimingSessionPermission(ProjectPermissionMixin):
  def _has_read_permission(self, role):
    return role.is_owner or role.can_review
    
  def has_object_permission(self, request, view, obj):
    # Admins can access all objects
    if request.user.is_staff:
      return True
      
    role = self._get_user_role(request)
    if not role:
      return False
      
    if request.method in permissions.SAFE_METHODS:
      return role.is_owner or role.can_review
      
    # Can only modify your own timing sessions
    return obj.coder_email == request.user.email
