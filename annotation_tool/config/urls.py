from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from django.views.generic.base import RedirectView

from api import views as api_views

from rest_framework import routers


project_router = routers.DefaultRouter()
project_router.register(r'assignment',            api_views.AssignmentViewSet)
project_router.register(r'coding',                api_views.CodingViewSet)
project_router.register(r'coding_instance',       api_views.CodingInstanceViewSet)
project_router.register(r'policy',                api_views.PolicyViewSet)
project_router.register(r'project_role',          api_views.ProjectRoleViewSet)
project_router.register(r'policy_instance',       api_views.PolicyInstanceViewSet)
project_router.register(r'policy_instance_meta',  api_views.PolicyInstanceMetaViewSet, 'PolicyInstanceMeta')
project_router.register(r'coding_instance_meta',  api_views.CodingInstanceMetaViewSet, 'CodingInstanceMeta')
project_router.register(r'project',               api_views.ProjectViewSet)
project_router.register(r'timing_session',        api_views.TimingSessionViewSet)

main_router = routers.DefaultRouter()
main_router.register(r'project', api_views.ProjectMetaViewSet)

class IndexView(TemplateView):
  template_name = 'frontend/index.html'

  def get_context_data(self, **kwargs):
    context = super().get_context_data(**kwargs)
    context['google_client_id'] = settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id']
    protocol = 'https' if self.request.is_secure() else 'http'
    domain = self.request.get_host()
    context['base_url'] = f"{protocol}://{domain}"
    context['vite_dev_server'] = settings.VITE_DEV_SERVER
    return context

favicon_view = RedirectView.as_view(url='/static/frontend/favicon.ico', permanent=True)

urlpatterns = [
  path('', IndexView.as_view()),
  re_path(r'^c/(.*)$',
    login_required(IndexView.as_view())),
  path(
    'core-api/', 
    include(main_router.urls)),
  path(
    'api/<str:project_prefix>/',
    include(project_router.urls)),
  path(
    'admin/',
    admin.site.urls),
  path(
    'accounts/',
    include('allauth.urls')),
  path(
    'api-auth/',
    include('rest_framework.urls', namespace='rest_framework')),
  path(
    "me/",
    login_required(api_views.get_current_user)),
  path(
    "favicon.ico", favicon_view
    ),
  *static(
    settings.STATIC_URL, 
    document_root=settings.STATIC_ROOT
  )
]
