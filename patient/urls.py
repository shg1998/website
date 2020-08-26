from django.urls import path
from .views import PatientCreateView, PatientDetailView, PatientDeleteView, PatientUpdateView, PatientListView, ImageAddView, ImageDeleteView, PointsUpdateView

urlpatterns = [
    path('patient/', PatientListView.as_view(), name='user-patients-list'),
    path('patient/<int:patient_id>/', PointsUpdateView.as_view(), name='patient-detail'),

    path('patient/new/', PatientCreateView.as_view(), name='patient-create'),
    path('patient/<int:pk>/update/', PatientUpdateView.as_view(), name='patient-update'),
    path('patient/<int:pk>/delete/', PatientDeleteView.as_view(), name='patient-delete'),

    path('patient/<int:patient_id>/imageAdd/', ImageAddView.as_view(), name='image-add'),
    path('patient/<int:patient_id>/<int:image_id>/pointsUpdate/', PointsUpdateView.as_view(), name='points-update'),
    path('patient/<int:patient_id>/<int:image_id>/imageDelete/', ImageDeleteView.as_view(), name='image-delete'),
]
