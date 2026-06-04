from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.response import Response
from rest_framework import status

from .models import Assignment
from .serializers import AssignmentSerializer


# ✅ Teacher Permission
from rest_framework.permissions import BasePermission


class IsTeacher(BasePermission):

    def has_permission(self, request, view):

        print("DEBUG USER:", request.user)
        print("DEBUG ROLE:", getattr(request.user, "role", None))

        if not request.user or not request.user.is_authenticated:
            return False

        return request.user.role == "teacher"


class AssignmentViewSet(viewsets.ModelViewSet):

    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        return Assignment.objects.filter(owner=self.request.user)

    # 🧨 HARD BLOCK (ADD THIS HERE)
    def create(self, request, *args, **kwargs):

        if request.user.role != "teacher":
            return Response(
                {"error": "Only teachers can create assignments"},
                status=403
            )

        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)