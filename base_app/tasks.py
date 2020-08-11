from celery import shared_task
import random
import requests


@shared_task
def nnService(image_url, patient_id, image_idx):
    
    setPoint_service_url = "127.0.0.1:8000/webservice/setPoints/"
    setResults = requests.post()
    
    return None
