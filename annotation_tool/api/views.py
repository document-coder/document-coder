from api.util import get_project_id_from_request
from django_filters.rest_framework import DjangoFilterBackend
from django.http import JsonResponse

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import (
  viewsets, 
  filters,
  permissions,
)

from api.permissions import (
  IsProjectOwner,
  HasProjectPermission,
  ProjectRolePermission,
  SchemaPermission,
  ContentPermission,
  MetaContentPermission,
  AnnotationPermission,
  AssignmentPermission,
  ProjectPermission,
  TimingSessionPermission,
)

from api.models import (
  Assignment,
  Coding,
  CodingInstance,
  Policy,
  PolicyInstance,
  Project,
  ProjectRole,
  TimingSession,
)

from api.serializers import (
  AssignmentSerializer,
  CodingInstanceSerializer,
  CodingSerializer,
  PolicyInstanceSerializer,
  PolicySerializer,
  ProjectRoleSerializer,
  ProjectSerializer,
  TimingSessionSerializer,
)


def get_current_user(request):
  return JsonResponse({
    "id": request.user.id,
    "email": request.user.email,
    "first_name": request.user.first_name,
    "last_name": request.user.last_name,
  })


class ProjectMetaViewSet(viewsets.ModelViewSet):
  queryset = Project.objects.all()
  serializer_class = ProjectSerializer
  permission_classes = [ProjectPermission]
  filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
  ordering_fields = '__all__'
  filterset_fields = ['id']
  lookup_field = "prefix"
  
  def get_queryset(self):
    return self.queryset.only('id', 'prefix', 'name')


class ProjectViewSet(viewsets.ModelViewSet):
  queryset = Project.objects.all()
  serializer_class = ProjectSerializer
  permission_classes = [ProjectPermission]
  filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
  ordering_fields = '__all__'
  filterset_fields = ['id']
  lookup_field = "prefix"
  


class ProjectFilteredViewSet(viewsets.ModelViewSet):
  def _get_project(self, request):
    """Get project from URL parameters"""
    project_id = get_project_id_from_request(request)
    return Project.objects.get(id=project_id)

  def get_queryset(self):
    project = self._get_project(self.request)
    return super().get_queryset().filter(project=project.id)

  def perform_create(self, serializer):
    project = self._get_project(self.request)
    serializer.save(project=project.id)

  def list(self, request, *args, **kwargs):
    queryset = self.filter_queryset(
      self.get_queryset().filter(project=get_project_id_from_request(request)))

    page = self.paginate_queryset(queryset)
    if page is not None:
      serializer = self.get_serializer(page, many=True)
      return self.get_paginated_response(serializer.data)

    serializer = self.get_serializer(queryset, many=True)
    return Response(serializer.data)


class AssignmentViewSet(ProjectFilteredViewSet):
  queryset = Assignment.objects.all()
  serializer_class = AssignmentSerializer
  permission_classes = [AssignmentPermission]
  filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
  ordering_fields = '__all__'
  filterset_fields = ['id']


class ProjectRoleViewSet(ProjectFilteredViewSet):
  queryset = ProjectRole.objects.all()
  serializer_class = ProjectRoleSerializer
  permission_classes = [ProjectRolePermission]
  filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
  ordering_fields = '__all__'
  filterset_fields = ['id']
  lookup_field = "prefix"


  @action(detail=True, methods=['post'])
  def update_role(self, request, project_id=None, pk=None):
    project = self.get_object()
    user_id = request.data.get('user_id')
    role_data = request.data.get('role', {})
    
    try:
      user = User.objects.get(id=user_id)
      role, created = ProjectRole.objects.update_or_create(
        project=project,
        user=user,
        defaults=role_data
      )
      return Response({'status': 'role updated'})
    except User.DoesNotExist:
      return Response(
        {'error': 'User not found'}, 
        status=status.HTTP_404_NOT_FOUND
      )

  @action(detail=True, methods=['get'])
  def list_roles(self, request, project_id=None, pk=None):
    project = self.get_object()
    roles = ProjectRole.objects.filter(project=project)
    data = [{
      'user_id': role.user.id,
      'user_email': role.user.email,
      'is_owner': role.is_owner,
      'can_modify_schema': role.can_modify_schema,
      'can_manage_content': role.can_manage_content,
      'can_assign_tasks': role.can_assign_tasks,
      'can_export_data': role.can_export_data,
      'can_review': role.can_review,
      'can_annotate': role.can_annotate,
    } for role in roles]
    return Response(data)


class CodingViewSet(ProjectFilteredViewSet):
  queryset = Coding.objects.all()
  serializer_class = CodingSerializer
  permission_classes = [SchemaPermission]
  filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
  ordering_fields = '__all__'
  filterset_fields = ['id', 'parent', 'created_dt']


class PolicyViewSet(ProjectFilteredViewSet):
  queryset = Policy.objects.all()
  serializer_class = PolicySerializer
  permission_classes = [ContentPermission]
  filter_backends = [DjangoFilterBackend,
                      filters.SearchFilter, filters.OrderingFilter]
  ordering_fields = '__all__'
  filterset_fields = [
    'id',
    'company_name',
    'name',
    'alexa_rank',
    'start_date',
    'end_date',
    'last_scan_dt',
    'scan_count'
  ]
  search_fields = ['name']


class CodingInstanceViewSet(ProjectFilteredViewSet):
  queryset = CodingInstance.objects.all()
  serializer_class = CodingInstanceSerializer
  permission_classes = [AnnotationPermission]
  filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
  ordering_fields = '__all__'
  filterset_fields = [
    'id', 
    'coder_email',
    'policy_instance_id', 
    'coding_id', 
    'created_dt'
  ]

  def create(self, request, **kw):
    policy_id=PolicyInstance.objects.get(
      id=request.data['policy_instance_id']
    ).policy_id
    instance = CodingInstance.objects.filter(
      coder_email=request.user.email,
      coding_id=request.data['coding_id'],
      policy_instance_id=request.data['policy_instance_id'],
      policy_id=policy_id,
    ).first()  # uniqueness avoids needs for limit
    if instance:
      instance.coding_values = request.data['coding_values']
    else:
      instance = CodingInstance.objects.create(
        coder_email=request.user.email,
        project=get_project_id_from_request(request),
        coding_id=request.data['coding_id'],
        policy_instance_id=request.data['policy_instance_id'],
        policy_id=policy_id,
        coding_values=request.data['coding_values'],
      )
    instance.save()
    return Response(CodingInstanceSerializer(instance).data)


class PolicyInstanceViewSet(ProjectFilteredViewSet):
  queryset = PolicyInstance.objects.all()
  serializer_class = PolicyInstanceSerializer
  permission_classes = [ContentPermission]
  filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
  ordering_fields = '__all__'
  filterset_fields = ['id', 'policy_id', 'scan_dt']

  def create(self, request, **kw):
    if request.data.get('id'):
      instance = PolicyInstance.objects.get(id=request.data['id'])
      instance.content = request.data.get('content', [])
    else:
      instance = PolicyInstance(
        policy_id=request.data['policy_id'],
        content=request.data.get('content', []),
        project=get_project_id_from_request(request),
        scan_dt=request.data['scan_dt']
      )
    instance.save()
    return Response(PolicyInstanceSerializer(instance).data)

class PolicyInstanceMetaViewSet(ProjectFilteredViewSet):
  queryset = PolicyInstance.objects.all()
  serializer_class = PolicyInstanceSerializer
  permission_classes = [MetaContentPermission]
  filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
  ordering_fields = '__all__'
  filterset_fields = ['id', 'policy_id', 'scan_dt']

  def get_queryset(self):
    return self.queryset.only('id', 'project', 'policy_id', 'scan_dt', 'last_updated')


class TimingSessionViewSet(viewsets.ModelViewSet):
  queryset = TimingSession.objects.all()
  serializer_class = TimingSessionSerializer
  permission_classes = [TimingSessionPermission]
  filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
  ordering_fields = '__all__'
  filterset_fields = ['id']

  def create(self, validated_data, **kw):
    instance = TimingSession.objects.filter(
      session_identifier=validated_data.data['session_identifier']
    ).first()
    if instance:
      for k, v in validated_data.data.items():
        setattr(instance, k, v)
    else:
      instance = TimingSession.objects.create(
        project=get_project_id_from_request(validated_data), **validated_data.data)
    instance.save()
    return Response(TimingSessionSerializer(instance).data)
