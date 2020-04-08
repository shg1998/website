from django import forms
from .models import info

class ReceptionForm(forms.ModelForm):
    class Meta:
        model = info
        fields = [
            'name',
            'owner',
            'national_id',
            'id_num',
            'age',
            'weight',
            'sex',
            'blood_type',
            'previous_test_results',
            # 'doctor',
            'prescription',
            'hospital',
            'imaging_center',
            'document',
            'annotations',
        ]