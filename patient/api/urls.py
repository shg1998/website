from django.urls import path

from patient.api.views import (
    PointsListView, 
    ImageView, 
    PatientImagesListView,
    AddPointsView,
    PatientsListView,
    pointViewset
     # patient_list, add_points, get_points, get_patients
    )
app_name = 'patient'

urlpatterns = [
    path("patients-list/", PatientsListView.as_view(), name='patients-list'),
    path("images-list/<pk>", PatientImagesListView.as_view(), name='images-list-show'),
    path("image/<pk>", ImageView.as_view(), name='image-show'),    
    path("points-list/<pk>", PointsListView.as_view(), name='points-list'),    
    # path("patientlist/",patient_list, name='patientList'),
    # path("addpoints/",add_points, name='addPoints'),
    path("<id>/add-points", AddPointsView.as_view(), name='add-points'),
    path("point/", pointViewset, name='point'),
]