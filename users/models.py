from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    ROLE_CHOICES = [
        ('teacher', 'Teacher'),
        ('student', 'Student'),
        ('admin', 'Admin'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    is_approved = models.BooleanField(default=False)

    roll_no = models.CharField(max_length=50, blank=True)
    father_name = models.CharField(max_length=100, blank=True)
    section = models.CharField(max_length=50, blank=True)
    shift = models.CharField(max_length=20, blank=True)
    phone = models.CharField(max_length=20, blank=True)

    def save(self, *args, **kwargs):

        # Admin always active
        if self.role == "admin":
            self.is_active = True
            self.is_approved = True
            self.status = "approved"

        elif self.role in ["teacher", "student"]:

            # If approved → active
            if self.is_approved:
                self.is_active = True
                self.status = "approved"
            else:
                # IMPORTANT: do NOT override rejected users
                self.is_active = False

                if self.status != "rejected":
                    self.status = "pending"

        super().save(*args, **kwargs)