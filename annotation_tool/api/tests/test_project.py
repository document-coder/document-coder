from .test_base import TestBase

class TestProject(TestBase):
  def test_project_crud(self):
    # Only admin can create
    self.authenticate(self.users[0])
    response = self.client.post('/core-api/project/', {'name': 'Test'})
    self.assertEqual(response.status_code, 403)
    
    # Admin can create
    project = self.create_project()
    
    # Anyone can view project list
    self.authenticate(self.users[0])
    response = self.client.get('/core-api/project/')
    self.assertIn(response.status_code, [200, 201, 202, 214])
    projects = response.json()
    self.assertEqual(projects['count'], 1)

    # Only admin can delete
    response = self.client.delete(f'/core-api/project/{project["id"]}/')
    self.assertEqual(response.status_code, 403)
    