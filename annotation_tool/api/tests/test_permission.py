
from .test_base import TestBase

class TestProjectRoles(TestBase):
  def test_role_assignment(self):
    project = self.create_project()
    
    # Make user0 owner
    self.create_project_role(
      project['id'], 
      self.users[0].email,
      {'is_owner': True}
    )
    
    # Owner can assign roles
    self.authenticate(self.users[0])
    self.create_project_role(
      project['id'],
      self.users[1].email, 
      {'can_annotate': True}
    )
    
    # Non-owner cannot assign roles
    self.authenticate(self.users[1])
    response = self.client.post('/api/test/project_role/', {
      'project': project['id'],
      'user_email': self.users[2].email
    })
    self.assertEqual(response.status_code, 403)
