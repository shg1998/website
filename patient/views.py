from django.shortcuts import render, redirect
from django.http import HttpResponse
from .forms import ReceptionForm
from .models import info, image, point
from django.contrib import messages
from django.forms import modelformset_factory



def new_patient(request):
    # pointForm = modelformset_factory(queryset = point.objects.none(), point, fields=('image', 'x', 'y'), extra=2)
    imageForm = modelformset_factory(image, fields=('document',), extra=2)
    
    if request.method == "POST":
        
        form   = ReceptionForm(request.POST)
        images = imageForm(request.POST, request.FILES)
        
        if form.is_valid() and images.is_valid():
            patient = form.save(commit=False)
            patient.doctor = request.user
            patient.save()
            image_set = images.save(commit=False)
            for img in image_set:
                img.patient = patient
                img.save()
            messages.success(request, "submitted")
            return redirect("patient:patientList")
    
    form = ReceptionForm()
    images = imageForm(queryset = image.objects.none())
    return render(request, 'patient/new_patient.html', {'form':form, 'images': images})


def patient_list(request):
    doctor = request.user
    patients = info.objects.filter(doctor_id__exact=doctor)
    # images = info.image_set.filter(doctor_id__exact=doctor)
    return render(request, 'patient/patient_list.html', {'patients':patients})


def patient_detail(request, pk):
    details = info.objects.filter(id__exact=pk)
    return render(request, 'patient/patient_detail.html', {'details':details})


def hospital_list(request):
    doctor = request.user
    hospitals = info.objects.filter(doctor_id__exact=doctor)
    return render(request, 'patient/patient_list.html', {'hospitals':hospitals})

def hospital_detail(request):
    hospital = info.objects.filter(id__exact=pk)
    hospital_det = info.objects.filter(doctor_id__exact=hospital)
    return render(request, 'patient/hospital_detail.html', {'hospital':hospital_det})