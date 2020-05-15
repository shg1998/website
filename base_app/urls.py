from django.urls import path
from base_app import views as base_views

urlpatterns = [
    path('', base_views.home, name='base-home'),
    path('about/', base_views.about, name='base-about'),
]