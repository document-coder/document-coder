from .test_base import TestBase
import json

class TestAssignments(TestBase):
  def test_assignment_flow(self):
    project = self.create_project()

    # Set up task manager
    self.create_project_role(
      project['id'],
      self.users[0].email,
      {'can_assign_tasks': True}
    )

    # Create policy and instance
    response = self.client.post('/api/test/policy/', {
      'project': project['id'],
      'name': 'test.com' 
    })
    self.assertIn(response.status_code, [200, 201, 202, 214])
    policy = response.json()

    response = self.client.post('/api/test/policy_instance/', {
      'project': project['id'],
      'policy_id': policy['id'],
      'content': json.dumps({'text': 'Test'})
    })
    self.assertIn(response.status_code, [200, 201, 202, 214])
    instance = response.json()

    # Create assignment
    self.authenticate(self.users[0])
    assignment_data = {
      'project': project['id'],
      'coder_email': self.users[1].email,
      'label': 'Test task',
      'type': 1,
      'notes': json.dumps({'policy_instance_id': instance['id']})
    }
    response = self.client.post('/api/test/assignment/', assignment_data)
    self.assertIn(response.status_code, [200, 201, 202, 214])
