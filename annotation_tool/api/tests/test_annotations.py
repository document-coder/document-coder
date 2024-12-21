import json
from .test_base import TestBase

class TestAnnotations(TestBase):
  def test_annotation_flow(self):
    project = self.create_project()
    
    # Set up schema manager
    self.create_project_role(
      project['id'],
      self.users[0].email, 
      {'can_modify_schema': True}
    )
    
    # Create coding scheme
    self.authenticate(self.users[0])
    coding_data = {
      'project': project['id'],
      'categories': json.dumps([{
        'id': 'q1',
        'text': 'Sample question',
        'type': 'multiple_choice',
        'options': ['Yes', 'No']
      }])
    }
    response = self.client.post('/api/test/coding/', coding_data)
    self.assertIn(response.status_code, [200, 201, 202, 214])
    coding = response.json()
    
    # Set up annotator
    self.create_project_role(
      project['id'],
      self.users[1].email,
      {'can_annotate': True}
    )
    
    # Upload document
    response = self.client.post('/api/test/policy/', {
      'project': project['id'],
      'name': 'test.com'
    })
    self.assertIn(response.status_code, [200, 201, 202, 214])

    policy = response.json()
    
    response = self.client.post('/api/test/policy_instance/', {
      'project': project['id'],
      'policy_id': policy['id'],
      'content': json.dumps({'text': 'Test content'})
    })
    policy_instance = response.json()
    
    # Create annotation
    self.authenticate(self.users[1])
    annotation_data = {
      'project': project['id'],
      'policy_id': policy['id'],
      'policy_instance_id': policy_instance['id'],
      'coding_id': coding['id'],
      'coding_values': json.dumps({
        'q1': {
          'value': 'Yes',
          'highlights': [{'start': 0, 'end': 4}]
        }
      })
    }
    response = self.client.post('/api/test/coding_instance/', annotation_data)
    self.assertIn(response.status_code, [200, 201, 202, 214])

