from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

User = get_user_model()

class TestBase(APITestCase):
  def setUp(self):
    self.admin = User.objects.create_superuser(
      username='admin',
      email='admin@test.com',
      password='test123'
    )
    self.users = [
      User.objects.create_user(
        username=f'user{i}',
        email=f'user{i}@test.com',
        password='test123'
      ) for i in range(3)
    ]
    
  def authenticate(self, user):
    self.client.force_authenticate(user=user)
    
  def create_project(self, prefix='test', name='Test Project'):
    self.authenticate(self.admin)
    response = self.client.post('/core-api/project/', {
      'prefix': prefix,
      'name': name
    })
    self.assertEqual(response.status_code, 201)
    return response.json()

  def create_project_role(self, project_id, user_email, permissions=None):
    self.authenticate(self.admin)
    default_permissions = {
      'is_owner': False,
      'can_modify_schema': False,
      'can_view_schema': True,
      'can_manage_content': False, 
      'can_view_content': True,
      'can_assign_tasks': False,
      'can_view_assignments': True,
      'can_export_data': False,
      'can_review': False,
      'can_annotate': False
    }
    role_data = {**default_permissions, **(permissions or {})}
    role_data.update({
      'project_id': project_id,
      'user_email': user_email
    })
    
    response = self.client.post(f'/api/test/project_role/', role_data)
    self.assertEqual(response.status_code, 201, response)
    return response.json()