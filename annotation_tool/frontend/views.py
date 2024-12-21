from django.views.generic.base import TemplateView
from api.models import Project

class HomePage(TemplateView):
  template_name = 'frontend/index.html'

  def get_context_data(self, **kwargs):
    context = super(HomePage, self).get_context_data(**kwargs)
    # self.request.GET.get('message', '')\
    projects = Project.objects.all()
    context['projects'] = reversed(sorted([
      {
        'name': project.name,
        'prefix': project.prefix,
      } for project in projects
    ], key=lambda x: f' {x["name"]}' if x['name'].startswith('[') else x['name'].lower()))
    return context

