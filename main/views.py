from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Latest
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages
from dashboard.views import dashboard
from account.models import Account
from account.forms import RegistrationForm

def homepage(request):
    return render(request = request, 
                  template_name = "main/homepage.html" ,
                  context = {"latest": Latest.objects.all})


def register(request):
    context = {}
    if request.method == "POST":
        form = RegistrationForm(request.POST)
        if form.is_valid:
            form.save()
            email = form.cleaned_data.get('email')
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            account = authenticate(email=email, password=raw_password)
            login(request, account)
            messages.success(request, f"welcome {username}")
            messages.info(request, f"logged in as: {username}")
            return redirect("main:homepage")
        else:
            context['registration_form'] = form
    else:
        form = RegistrationForm()
        context['registration_form'] = form
    return render(request, "main/register.html", context)


def logout_request(request):
    logout(request)
    messages.info(request, "logged out successfully! ")
    return redirect("main:homepage")



def login_request(request):
    if request.method == "POST":
        form = AuthenticationForm(request, request.POST)
        if form.is_valid():
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.info(request, f"logged in as: {username}")
                return redirect("dashboard:dashboard")
            else:
                messages.error(request, "invalid username or password ")
        else:
            messages.error(request, "invalid login credentials. ")

    form = AuthenticationForm()
    return render(request, 
                  "main/login.html",
                  {"form": form})











