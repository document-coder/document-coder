from django.db import models
from django.contrib.postgres import fields as postgres_fields
import datetime
from config import settings

def _two_weeks_from_now():
  from django.utils.timezone import timezone
  return datetime.datetime.now(tz=timezone.utc) + datetime.timedelta(days=14)

class ProjectRole(models.Model):
  project = models.BigIntegerField(default=1)
  user_email = models.CharField(max_length=255)
  is_owner = models.BooleanField(default=False)
  can_modify_schema = models.BooleanField(default=False) 
  can_view_schema = models.BooleanField(default=True)
  can_manage_content = models.BooleanField(default=False)
  can_view_content = models.BooleanField(default=True)
  can_assign_tasks = models.BooleanField(default=False)
  can_view_assignments = models.BooleanField(default=True)
  can_export_data = models.BooleanField(default=False)
  can_review = models.BooleanField(default=False)
  can_annotate = models.BooleanField(default=False)

  class Meta:
    unique_together = ['project', 'user_email']


class KVStore(models.Model):
  project = models.BigIntegerField(default=1)
  k = models.CharField(max_length=255, db_index=True)
  v = models.JSONField(default=dict)


class Assignment(models.Model):
  project = models.BigIntegerField(default=1)
  created_dt = models.DateTimeField(auto_now_add=True)
  coder_email = models.CharField(max_length=255, null=True)
  url = models.CharField(max_length=255, null=True)
  label = models.CharField(max_length=255, default="")
  notes = models.JSONField(default=dict)
  due_dt = models.DateTimeField(default=_two_weeks_from_now)
  completed_dt = models.DateTimeField(null=True)
  status = models.CharField(max_length=31, default="TRIAGE")
  last_updated = models.DateTimeField(auto_now=True)


class Coding(models.Model):
  project = models.BigIntegerField(default=1)
  parent = models.BigIntegerField(null=True)
  created_dt = models.DateTimeField(auto_now_add=True)
  categories = models.JSONField(default=list)
  meta = models.JSONField(default=dict)
  last_updated = models.DateTimeField(auto_now=True)


class Project(models.Model):
  prefix = models.CharField(max_length=255, db_index=True)
  name = models.CharField(max_length=255)
  settings = models.JSONField(default=dict, blank=True, null=False)
  last_updated = models.DateTimeField(auto_now=True)


class CodingInstance(models.Model):
  project = models.BigIntegerField(default=1)
  coder_email = models.CharField(
      max_length=255, db_index=True, default="unknown")
  policy_id = models.BigIntegerField(db_index=True)
  policy_instance_id = models.BigIntegerField(db_index=True)
  coding_id = models.BigIntegerField(db_index=True)
  created_dt = models.DateTimeField(auto_now_add=True)
  coding_values = models.JSONField()
  last_updated = models.DateTimeField(auto_now=True)

  class Meta:
    unique_together = ('coder_email', 'coding_id', 'policy_instance_id')


class Policy(models.Model):
  # XXX: many of these fields are extraneous and only retained because of null-op dependacies that should be removed.
  project = models.BigIntegerField(default=1)
  company_name = models.CharField(max_length=255, default=str)
  name = models.CharField(max_length=255, db_index=True)
  locale = models.CharField(max_length=32, null=True)
  alexa_rank = models.BigIntegerField(null=True)
  alexa_rank_US = models.BigIntegerField(null=True)
  urls = models.JSONField(default=dict)
  start_date = models.DateField(null=True)
  end_date = models.DateField(null=True)
  last_scan_dt = models.DateTimeField(null=True)
  scan_count = models.BigIntegerField(default=0)
  categories = models.JSONField(default=list)
  meta = models.JSONField(default=dict)
  progress = models.JSONField(default=dict)
  last_updated = models.DateTimeField(auto_now=True)


class PolicyInstance(models.Model):
  project = models.BigIntegerField(default=1)
  policy_id = models.BigIntegerField(db_index=True)
  scan_dt = models.DateField()
  content = models.JSONField()
  last_updated = models.DateTimeField(auto_now=True)


class TimingSession(models.Model):
  # uses coding, coder_email, and policy_instance_id instead of coding_instance_id because a timing session might
  # be created before the corresponding coding instance.
  # XXX: it would make more sense to create a coding instance on session creation if it doesn't exist, and just use that.
  project = models.BigIntegerField(default=1)
  coder_email = models.CharField(max_length=255)
  coding_id = models.BigIntegerField()
  policy_instance_id = models.BigIntegerField()
  question_timings = models.JSONField()
  session_timing = models.JSONField()
  session_identifier = models.BigIntegerField(unique=True)
  last_updated = models.DateTimeField(auto_now=True)
