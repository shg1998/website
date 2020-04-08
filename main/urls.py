from django.urls import path
from . import views
from dashboard import views as dashboardViews

app_name = "main"

urlpatterns = [
    path("", views.homepage, name = "homepage"),
    path("register/", views.register, name="register"),
    path("login/", views.login_request, name="login"),
    path("logout/", views.logout_request, name="logout"),
]
