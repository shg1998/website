import os
import torch
import torchvision
import torchvision.transforms as transforms
from PIL import Image

from patient.models import ImagePatient
from .webservice import setPoints

from celery import shared_task
import requests
from io import BytesIO

@shared_task
def nnService(image_url, patient_id, image_idx):
      
    transform = transforms.ToTensor()
    normalize = transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[1, 1, 1])
    res_to = 256
    model_path9 = "base_app/checkpoint_202008061041.pth.tar"
    model_path3 = "base_app/checkpoint_3points_202008091543.pth.tar"
    image_address = "http://172.93.194.118"+image_url
    response = requests.get(image_address)

    model9  = torchvision.models.resnet18(num_classes=18).cpu()
    model3  = torchvision.models.resnet18(num_classes=6).cpu()
    model9.load_state_dict(torch.load(model_path9, map_location=torch.device('cpu'))['model_state_dict'], strict='False')
    model9.eval()
    model3.load_state_dict(torch.load(model_path3, map_location=torch.device('cpu'))['model_state_dict'], strict='False')
    model3.eval()

    with Image.open(BytesIO(response.content)) as img:
        input_image = img.convert('RGB')
    input_image_resized = input_image.resize((res_to, res_to))
    input_image_resized = transform(input_image_resized)
    input_image_resized = normalize(input_image_resized)
    input_image_resized = input_image_resized.unsqueeze(0)
    input_image_resized = input_image_resized[:, :, 14:241, 14:241]

    pred9 = model9(input_image_resized).detach().numpy()
    pred3 = model3(input_image_resized).detach().numpy()

    my_list_9 = [round(x.item()) for x in pred9[0, :]]
    my_list_3 = [round(x.item()) for x in pred3[0, :]]
    my_list   = my_list_9[0:12] + my_list_3

    

    points = [[my_list[2*i],my_list[2*i+1]] for i in range(int(len(my_list)/2))]
    for point in points:
        point[0]=float(img.size[0])/res_to*(point[0]+14)  
        point[1]=float(img.size[1])/res_to*(point[1]+14)

    print(points)
    object = ImagePatient.objects.filter(patient_imag=patient_id)[image_idx]
    object.points_imag = points
    object.save()
    return points