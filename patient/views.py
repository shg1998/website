from django.shortcuts import render
from django.http import HttpResponse
from .forms import ReceptionForm
from .models import info
from django.contrib import messages



# Create your views here.
def reception(request):
    
    if request.method == "POST":
        form = ReceptionForm(request.POST, request.FILES or None)
        if form.is_valid():
            patient = form.save(commit=False)
            patient.doctor = request.user
            patient.save()
            messages.success(request, "submitted")

    doctor = request.user
    form = ReceptionForm()
    patients = info.objects.filter(doctor_id__exact=doctor)
    return render(request, 'patient/index.html', {'form':form, 'patients':patients  })