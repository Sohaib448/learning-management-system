from rest_framework import generics
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404

from .serializer import RegisterSerializer

User = get_user_model()


# =========================
# REGISTER
# =========================
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


# =========================
# SIGNUP REQUEST
# =========================
@api_view(['POST'])
def signup_request(request):
    try:
        data = request.data
        username = data.get("username")

        if not username:
            return Response({"error": "Username required"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=400)

        User.objects.create_user(
            username=username,
            password=data.get("password"),
            email=data.get("email"),
            role=data.get("role", "student"),
            is_active=False,
            is_approved=False,
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
            roll_no=data.get("roll_no", ""),
            father_name=data.get("father_name", ""),
            section=data.get("section", ""),
            shift=data.get("shift", ""),
            phone=data.get("phone", ""),
        )

        return Response({"message": "Signup request submitted"}, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=500)


# =========================
# USERS LIST
# =========================
@api_view(['GET'])
def users_list(request):
    users = User.objects.all()
    data = []

    for u in users:
        base = {
            "id": u.id,
            "username": u.username,
            "role": u.role,
            "is_approved": u.is_approved,
            "is_active": u.is_active,
            "status": u.status,
            "email": u.email,
        }

        if u.role == "student":
            base.update({
                "roll_no": u.roll_no,
                "father_name": u.father_name,
                "section": u.section,
                "shift": u.shift,
                "phone": u.phone,
            })

        if u.role == "teacher":
            base.update({
                "first_name": u.first_name,
                "last_name": u.last_name,
                "subject": getattr(u, "subject", ""),
                "father_name": u.father_name,
                "shift": u.shift,
                "phone": u.phone,
            })

        data.append(base)

    return Response(data)


# =========================
# UPDATE STATUS (FIXED)
# =========================
@api_view(['PATCH'])
def update_user_status(request, pk):
    user = get_object_or_404(User, pk=pk)

    is_approved = request.data.get("is_approved", None)
    is_active = request.data.get("is_active", None)
    status_val = request.data.get("status", None)

    if is_approved is not None:
        user.is_approved = is_approved

    if is_active is not None:
        user.is_active = is_active

    # IMPORTANT FIX FOR REJECT
    if status_val == "rejected":
        user.status = "rejected"
        user.is_approved = False
        user.is_active = False

    elif user.is_approved:
        user.status = "approved"
    else:
        user.status = "pending"

    user.save()

    return Response({
        "message": "User updated",
        "id": user.id,
        "is_approved": user.is_approved,
        "is_active": user.is_active,
        "status": user.status
    })