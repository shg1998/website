from django.urls import path
from . import views

app_name = "patient"

urlpatterns = [
    path("", views.reception, name = "patient")
]
