from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from patient.models import info
from patient.api.serializers import infoSerializer


@api_view(['GET',])
@permission_classes((IsAuthenticated,))
def patient_list(request):
    try:
        patients_info = info.objects.filter(doctor_id__exact=request.user)
    except info.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = infoSerializer(patients_info, many=True)
    return Response(serializer.data)


@api_view(['PUT',])
@permission_classes((IsAuthenticated,))
def add_points(request):

    try:
        patients_info = info.objects.filter(doctor_id__exact=request.user)
    except info.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    name = request.data['name']
    patients_info = info.objects.filter(name__exact=name)


    serializer = infoSerializer(patients_info, data=request.data)
    data = {}
    if serializer.is_valid():
        serializer.save()
        data['success'] = 'added successfuly'
        return Response(data=data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET',])
def get_points(request, slug):

    try:
        patient_info = info.objects.get(slug=slug)
    except info.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # name = patient_info.name
    serializer = infoSerializer(patient_info)
    return Response(serializer.data)


@api_view(['GET',])
def get_patients(request, slug):

    try:
        patient_info = info.objects.get(slug=slug)
    except info.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = infoSerializer(patient_info)
    return Response(serializer.data)