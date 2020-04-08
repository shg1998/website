from django.db import models
from django.conf import settings
import json


def document_location(instance, filename):
    
    file_path = 'static/patient/{doctor_id}/{patient_name}-{document_name}'.format(
        doctor_id = str(instance.doctor.id),
        patient_name = str(instance.name),
        document_name = filename
    )
    # file_path = f"patient/{instance.doctor.id}/{filename}"

    return file_path


class info(models.Model):

    name                    = models.CharField(max_length=150)
    owner                   = models.CharField(max_length=150, default='some')
    national_id             = models.IntegerField(default=1)
    id_num                  = models.IntegerField(default=1)
    date_visited            = models.DateTimeField(auto_now=True)
    age                     = models.FloatField(default=1.1)
    weight                  = models.FloatField(default=1.1)
    sex                     = models.BooleanField(default=True)
    blood_type              = models.CharField(max_length=5, default='some')
    previous_test_results   = models.TextField(default="some")
    doctor                  = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    prescription            = models.TextField(default='some')
    hospital                = models.CharField(max_length=150, default='some')
    imaging_center          = models.CharField(max_length=150, default='some')
    document                = models.FileField(upload_to=document_location, default='/test.jpg', null=False, blank=False)
    annotations             = models.CharField(max_length=500, default='    ')

    def set_points(self, x):
        self.annotations = json.dumps(x)

    def get_points(self):
        return json.loads(self.annotations)


    def __str__(self):
        return self.name