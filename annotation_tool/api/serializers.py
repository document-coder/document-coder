from rest_framework import serializers
from api import models

def _field_list(table, to_omit=None):
  return [
    f.name for f in table._meta.fields
    if f.name not in (to_omit or [])
  ]

class AssignmentSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = models.Assignment
    fields = _field_list(models.Assignment)

class ProjectSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = models.Project
    fields = _field_list(models.Project)

class ProjectRoleSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = models.ProjectRole
    fields = _field_list(models.ProjectRole)

class CodingSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = models.Coding
    fields = _field_list(models.Coding)

class CodingInstanceSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = models.CodingInstance
    fields = _field_list(models.CodingInstance)

class PolicySerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = models.Policy
    fields = _field_list(models.Policy)

class PolicyInstanceSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = models.PolicyInstance
    fields = _field_list(models.PolicyInstance)

class PolicyInstanceDocumentSerializer(serializers.Serializer):
  class Meta:
    model = models.PolicyInstance
    fields = []

class PolicyInstanceInfoSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = models.PolicyInstance
    fields = _field_list(models.PolicyInstance, to_omit=['content'])

class TimingSessionSerializer(serializers.HyperlinkedModelSerializer):
  class Meta:
    model = models.TimingSession
    fields = _field_list(models.TimingSession)