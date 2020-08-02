from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from patient.models import ImagePatient
from django.shortcuts import redirect
import json
import random

@login_required
def getImage(request, patient_id, image_id):
    object=ImagePatient.objects.filter(patient_imag=patient_id)[image_id]
    if object.patient_imag.doctor_pati != request.user: return True

    image_url=object.image_imag.url
    return redirect("http://127.0.0.1:8000"+image_url)
    # return HttpResponse("http://127.0.0.1:8000"+image_url)


@login_required
def getImageList(request, patient_id):
    objectList=ImagePatient.objects.filter(patient_imag=patient_id)
    if objectList[0] and objectList[0].patient_imag.doctor_pati != request.user: return True

    urlList=["http://127.0.0.1:8000"+ImClass.image_imag.url for ImClass in objectList]
    return JsonResponse(json.dumps(urlList), safe=False)


@login_required
def getPoints(request, patient_id, image_id):
    object=ImagePatient.objects.filter(patient_imag=patient_id)[image_id]
    if object.patient_imag.doctor_pati != request.user: return True

    # points=object.points_imag
    points = []
    for i in range(random.randrange(1,15)):
        points.append([random.randrange(1,300), random.randrange(1,400)])
    return JsonResponse(json.dumps(points), safe=False)
    # return HttpResponse('<p>'+str(points)+'</p>')

@login_required
def setPoints(request, patient_id, image_id):
    object=ImagePatient.objects.filter(patient_imag=patient_id)[image_id]
    if object.patient_imag.doctor_pati != request.user: return True

    if request.method == 'POST':
        import ast
        object.points_imag=ast.literal_eval(request.POST["points"])
        object.save()
    return HttpResponse('')
