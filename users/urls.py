from django.urls import path
from .views import RegisterView, signup_request, users_list, update_user_status

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('signup-request/', signup_request),
    path('users/', users_list),

    # update approve/reject
    path('users/<int:pk>/', update_user_status),
]