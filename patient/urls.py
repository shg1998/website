from django.urls import path
from . import views

app_name = "patient"

urlpatterns = [
    path("new_patient", views.new_patient, name = "newPatient"),
    path("patient_list/", views.patient_list, name = "patientList"),
    path("patient_detail/<pk>", views.patient_detail, name = "patientDetail"),
]
