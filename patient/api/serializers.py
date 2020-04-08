from rest_framework import serializers

from patient.models import info 

class infoSerializer(serializers.ModelSerializer):
    class Meta:
        model = info
        fields = [  'name',
                    'owner',
                    'national_id',
                    'id_num',
                    'age',
                    'weight',
                    'sex',
                    'blood_type',
                    'previous_test_results',
                    'doctor',
                    'prescription',
                    'hospital',
                    'imaging_center',
                    'document',
                ]