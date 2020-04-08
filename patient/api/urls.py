from django.urls import path

from patient.api.views import patient_list, add_points, get_points, get_patients

app_name = 'patient'

urlpatterns = [
    path("patientlist/",patient_list, name='patientList'),
    path("addpoints/",add_points, name='addPoints'),
    path("get_points/",get_points, name='getPoints'),
    path("get_patients/",get_patients, name='getPatients'),
]