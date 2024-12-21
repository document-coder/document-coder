
from api.models import Project


def get_project_prefix_from_request(request):
  try:
    return request.parser_context['kwargs']['project_prefix']
  except (KeyError, ValueError):
    return None


def get_project_id_from_request(request):
  try:
    return Project.objects.get(prefix=get_project_prefix_from_request(request)).id
  except Project.DoesNotExist:
    return None