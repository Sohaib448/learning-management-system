from django.db import models
from django.conf import settings
from assignment.models import Assignment


class Submission(models.Model):

    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('late', 'Late'),
    ]

    GRADE_CHOICES = [
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('excellent', 'Excellent'),
    ]

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.CASCADE
    )

    # ✅ NEW FIELDS (IMPORTANT)
    student_username = models.CharField(max_length=150, blank=True, null=True)
    roll_number = models.CharField(max_length=50, blank=True, null=True)

    submission_text = models.TextField(blank=True, null=True)

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

    marks = models.IntegerField(null=True, blank=True)
    remarks = models.TextField(blank=True, null=True)
    grade = models.CharField(
        max_length=20,
        choices=GRADE_CHOICES,
        null=True,
        blank=True
    )

    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.username} - {self.assignment.title}"