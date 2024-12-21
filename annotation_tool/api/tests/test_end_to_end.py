from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

User = get_user_model()

class TestBase(APITestCase):
  def setUp(self):
    # Create admin and regular users
    self.admin = User.objects.create_superuser(
      username='admin',
      email='admin@test.com',
      password='test123'
    )
    self.user1 = User.objects.create_user(
      username='user1',
      email='user1@test.com',
      password='test123'
    )
    self.user2 = User.objects.create_user(
      username='user2',
      email='user2@test.com', 
      password='test123'
    )

  def authenticate(self, user):
    self.client.force_authenticate(user=user)

class TestProjectCreation(TestBase):
  def test_only_admin_can_create_project(self):
    project_data = {
      'prefix': 'test',
      'name': 'Test Project'
    }

    # Test unauthorized
    self.authenticate(self.user1)
    response = self.client.post('/core-api/project/', project_data)
    self.assertEqual(response.status_code, 403)

    # Test authorized
    self.authenticate(self.admin)
    response = self.client.post('/core-api/project/', project_data)
    self.assertEqual(response.status_code, 201)
    project = response.json()
    self.assertIsNotNone(project['id'])
