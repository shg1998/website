from celery import shared_task
from random import randrange
import requests
from patient.models import ImagePatient
from .webservice import setPoints


@shared_task
def nnService(image_url, patient_id, image_idx):
    
    # setPoint_service_url = "http://127.0.0.1:8000/webservice/setPoints/" + str(patient_id) + "/" + str(image_idx) + "/"
    points = [[randrange(0, 500),randrange(0, 500)] for i in range(randrange(15))]    
    # setResult = requests.post(setPoint_service_url, data=load)
    # print(setResult.status_code)
    object = ImagePatient.objects.filter(patient_imag=patient_id)[image_idx]
    object.points_imag = points
    object.save()
    return points
