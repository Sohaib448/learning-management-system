from django.db import models
from django.conf import settings
from assignment.models import Assignment


class Submission(models.Model):

    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('late', 'Late'),
    ]

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.CASCADE
    )

    # ✅ TEXT SUBMISSION (optional now)
    submission_text = models.TextField(blank=True, null=True)

    # ✅ FILE SUBMISSION (NEW)
    submission_file = models.FileField(
        upload_to='submissions/',
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='submitted'
    )

    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.username} - {self.assignment.title}"