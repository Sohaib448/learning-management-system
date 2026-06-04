from rest_framework import serializers
from .models import Submission


class SubmissionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Submission

        fields = [
            'id',
            'assignment',
            'submission_text',
            'status',
            'submitted_at'
        ]

        # 🚨 CRITICAL FIX: prevent user manipulation
        read_only_fields = ['status', 'submitted_at', 'student']