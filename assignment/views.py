from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.response import Response

from .models import Assignment
from .serializers import AssignmentSerializer


# =========================
# TEACHER PERMISSION
# =========================
class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            getattr(request.user, "role", None) == "teacher"
        )


# =========================
# VIEWSET
# =========================
class AssignmentViewSet(viewsets.ModelViewSet):
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]

    # ✅ Everyone can view
    def get_queryset(self):
        return Assignment.objects.all().order_by("-created_at")

    # ✅ Create assignment (ONLY TEACHER)
    def create(self, request, *args, **kwargs):

        if getattr(request.user, "role", None) != "teacher":
            return Response(
                {"error": "Only teachers can create assignments"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            # 🔥 IMPORTANT: show real backend error to frontend
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # ✅ attach owner automatically
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)