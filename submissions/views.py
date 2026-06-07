from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.timezone import now

from .models import Submission
from .serializers import SubmissionSerializer


# =========================
# ROLE PERMISSIONS
# =========================
class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            getattr(request.user, "role", None) == "student"
        )


class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            getattr(request.user, "role", None) == "teacher"
        )


# =========================
# VIEWSET
# =========================
class SubmissionViewSet(viewsets.ModelViewSet):

    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_queryset(self):
     user = self.request.user

     qs = Submission.objects.select_related("student", "assignment").order_by("-submitted_at")

    # TEACHER:
    # show ONLY pending (not reviewed yet)
     if getattr(user, "role", None) == "teacher":
        return qs.filter(status="submitted")

    # STUDENT:
     return qs.filter(student=user)

    def perform_create(self, serializer):
        assignment = serializer.validated_data.get("assignment")

        status_value = (
            "late" if now().date() > assignment.deadline else "submitted"
        )

        serializer.save(
            student=self.request.user,
            status=status_value
        )

    @action(detail=False, methods=['post'], url_path='update-status')
    def update_status(self, request):

     submission_id = request.data.get("submission_id")

     if not submission_id:
        return Response({"error": "submission_id required"}, status=400)

     try:
        submission = Submission.objects.get(id=submission_id)
     except Submission.DoesNotExist:
        return Response({"error": "Submission not found"}, status=404)

     submission.marks = request.data.get("marks", submission.marks)
     submission.remarks = request.data.get("remarks", submission.remarks)

     submission.status = "reviewed"

     submission.save()

     return Response(SubmissionSerializer(submission).data, status=200)