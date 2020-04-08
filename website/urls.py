from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include   

urlpatterns = [
    path('', include('main.urls')),
    path('admin/', admin.site.urls),
    path('patients/', include('patient.urls')),
    path('dashboard/', include('dashboard.urls', namespace='dashboard')),

    # api urls
    path('api/patient/', include('patient.api.urls', namespace='patient_api')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)