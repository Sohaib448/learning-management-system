from rest_framework.routers import DefaultRouter
from .views import AssignmentViewSet

router = DefaultRouter()

router.register('assignment', AssignmentViewSet, basename='assignments')

urlpatterns = router.urls