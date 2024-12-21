from .test_base import TestBase
import json

class TestDocumentUpload(TestBase):
  def test_document_upload(self):
    project = self.create_project()

    # Set up content manager
    self.create_project_role(
      project['id'],
      self.users[0].email,
      {'can_manage_content': True}
    )

    policy_data = {
      'project': project['id'],
      'name': 'example.com',
      'company_name': 'Example Inc'
    }

    # Only content managers can create policies
    self.authenticate(self.users[1])
    response = self.client.post('/api/test/policy/', policy_data)
    self.assertEqual(response.status_code, 403)

    self.authenticate(self.users[0])
    response = self.client.post('/api/test/policy/', policy_data)
    self.assertIn(response.status_code, [200, 201, 202, 214])
    policy = response.json()

    # Upload policy instance
    instance_data = {
      'project': project['id'],
      'policy_id': policy['id'],
      'content': json.dumps({
        'documents': [{
          'title': 'Privacy Policy',
          'text': 'Example privacy policy text'
        }]
      })
    }
    response = self.client.post('/api/test/policy_instance/', instance_data)
    self.assertIn(response.status_code, [200, 201, 202, 214])

