from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import JSONField


def document_location(instance, filename):
    
    file_path = 'patient/{doctor_id}/{patient_name}/{document_name}'.format(
        doctor_id = str(instance.patient.doctor.id),
        patient_name = str(instance.patient.name),
        document_name = filename
    )
    return file_path


class info(models.Model):

    def __str__(self):
        return self.name
    # owner                    = models.ForeignKey(settings.AUTH_USER_MODEL)
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
    # document                = models.FileField(upload_to=document_location, null=False, blank=False)
    # annotations             = models.CharField(max_length=500, default='    ')


class image(models.Model):
    # owner        = models.ForeignKey(settings.AUTH_USER_MODEL)
    patient     = models.ForeignKey(info, on_delete=models.CASCADE)
    document    = models.FileField(upload_to=document_location, null=False, blank=False)

    def __str__(self):
        return self.patient.name


class point(models.Model):
    # owner  = models.ForeignKey(settings.AUTH_USER_MODEL)
    image = models.ForeignKey(image, on_delete=models.CASCADE)
    point = JSONField(default=dict)
    # x     = models.IntegerField()
    # y     = models.IntegerField()
    # point = str(x) + " " + str(y)

    def __str__(self):
        return self.point