from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm

User = get_user_model()


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ("username", "email", "role")


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ("username", "email", "role", "is_active", "is_approved", "is_staff")


@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):

    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    list_display = ("username", "email", "role", "is_approved", "is_active", "is_staff")

    list_filter = ("role", "is_approved", "is_active")

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal Info", {"fields": ("email", "role")}),
        ("Approval System", {"fields": ("is_approved", "is_active")}),
        ("Permissions", {"fields": ("is_staff", "is_superuser")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "email", "role", "password1", "password2"),
        }),
    )

    search_fields = ("username", "email")
    ordering = ("username",)