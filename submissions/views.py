from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.response import Response
from rest_framework import status
from django.utils.timezone import now

from assignment.models import Assignment
from .models import Submission
from .serializer import SubmissionSerializer


# ✅ Student Permission (FIXED SAFETY)
class IsStudent(BasePermission):

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            getattr(request.user, "role", None) == "student"
        )


class SubmissionViewSet(viewsets.ModelViewSet):

    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        return Submission.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        assignment = serializer.validated_data['assignment']

        # ⏱ AUTO STATUS LOGIC
        if now().date() > assignment.deadline:
            submission_status = 'late'
        else:
            submission_status = 'submitted'

        serializer.save(
            student=self.request.user,
            status=submission_status
        )