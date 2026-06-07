from rest_framework import serializers
from .models import Assignment

class AssignmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Assignment
        fields = [
            'id',
            'title',
            'description',
            'status',
            'deadline',
            'created_at',
            'owner'
        ]
        read_only_fields = ['id', 'created_at', 'owner']