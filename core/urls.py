from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # AUTH FIRST
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),

    # APPS
    path('api/', include('users.urls')),
    path('api/', include('assignment.urls')),
    path('api/', include('submissions.urls')),
]