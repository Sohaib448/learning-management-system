from rest_framework import serializers
from .models import Submission


class SubmissionSerializer(serializers.ModelSerializer):

    # =========================
    # STUDENT INFO
    # =========================
    student_username = serializers.CharField(
        source='student.username',
        read_only=True
    )

    student_id = serializers.IntegerField(
        source='student.id',
        read_only=True
    )

    # =========================
    # ASSIGNMENT INFO
    # =========================
    assignment_title = serializers.CharField(
        source='assignment.title',
        read_only=True
    )

    assignment_description = serializers.CharField(
        source='assignment.description',
        read_only=True
    )

    assignment_deadline = serializers.DateField(
        source='assignment.deadline',
        read_only=True
    )

    assignment_id = serializers.IntegerField(
        source='assignment.id',
        read_only=True
    )

    class Meta:
        model = Submission

        fields = [
            'id',

            # student
            'student',
            'student_username',
            'student_id',

            # assignment
            'assignment',
            'assignment_title',
            'assignment_description',
            'assignment_deadline',
            'assignment_id',

            # submission
            'submission_text',
            'submission_file',

            # grading
            'status',
            'marks',
            'grade',
            'remarks',

            'submitted_at',
        ]

        read_only_fields = [
            'student',
            'student_username',
            'student_id',

            'assignment_title',
            'assignment_description',
            'assignment_deadline',
            'assignment_id',

            'status',
            'submitted_at'
        ]