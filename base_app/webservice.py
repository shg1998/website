from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from patient.models import ImagePatient


@login_required
def getImage(request, patient_id, image_id):
    object=ImagePatient.objects.filter(patient_imag=patient_id)[image_id]
    if object.patient_imag.doctor_pati != request.user: return True

    image_url=object.image_imag.url
    return HttpResponse('<img src="'+image_url+'">')


@login_required
def getPoints(request, patient_id, image_id):
    object=ImagePatient.objects.filter(patient_imag=patient_id)[image_id]
    if object.patient_imag.doctor_pati != request.user: return True

    points=object.points_imag
    return HttpResponse('<p>'+str(points)+'</p>')

@login_required
def setPoints(request, patient_id, image_id):
    object=ImagePatient.objects.filter(patient_imag=patient_id)[image_id]
    if object.patient_imag.doctor_pati != request.user: return True

    if request.method == 'POST':
        import ast
        object.points_imag=ast.literal_eval(request.POST["points"])
        object.save()
    return HttpResponse('')