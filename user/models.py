from django.db import models
from django.contrib.auth.models import User


class Hospital(models.Model):
    name_hosp = models.CharField(max_length=200)
    address_hosp = models.TextField(max_length=200)


class UserProfile(models.Model):
    name_user = models.CharField(max_length=200)
    image_user = models.ImageField(default='default.jpg', upload_to='profile_pic')
    hosp_user = models.ManyToManyField(Hospital)
    # type_user = models.??()

    user = models.OneToOneField(User, on_delete=models.CASCADE)
