from django.db import models
from django.utils import timezone

# Create your models here.
class Latest(models.Model):
    
    news_name = models.CharField(max_length=200)
    news_description = models.TextField(max_length=500)
    news_date = models.DateTimeField()

    def __str__(self):
        return self.news_name