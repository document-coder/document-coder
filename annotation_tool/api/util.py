from api.models import Project

def send_invite_email(request, invitor=None, invitee=None):
  try:
    project_name = get_project_name_from_request(request)
    current_hostname = request.get_host()
    email_content = {
      "subject": (
        f"{invitor} has invited you to join a document annotation project"
      ),
      "message": (
        f"""
        {invitor} has invited you to join their document annotation project: {project_name}. 
        To accept the invitation, sign in using the link below.
        """
      ),
      "from": (
        f"""noreply@{current_hostname}"""
      ),
      "to": (
        [f"{invitee}"]
      )
    }
    print("email sending currently disabled")
    print(email_content)
    return False
    print("Sending email")
    from django.core.mail import send_mail
    send_mail(
      fail_silently=False,
    )
    print("done")
  except Exception as e:
    print("Error sending email", e)
    # import traceback
    # traceback.print_exc()

def get_project_name_from_request(request):
  try:
    return Project.objects.get(prefix=get_project_prefix_from_request(request)).name
  except Project.DoesNotExist:
    return None

def get_project_prefix_from_request(request):
  try:
    return request.parser_context['kwargs']['project_prefix']
  except (KeyError, ValueError):
    return None


def get_project_id_from_request(request):
  try:
    return Project.objects.get(prefix=get_project_prefix_from_request(request)).id
  except Project.DoesNotExist:
    return None