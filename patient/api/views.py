from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import (
    ListAPIView, 
    RetrieveAPIView,
    UpdateAPIView,
    DestroyAPIView,
    RetrieveUpdateDestroyAPIView,
    )
from .permissions import IsOwner
from patient.models import info, point, image
from patient.api.serializers import (
    InfoSerializer,
    ImageSerializer, 
    PointSerializer,
    )



class PointsListView(ListAPIView):
    serializer_class = PointSerializer
    permission_classes = [IsOwner]
    def get_queryset(self):
        queryset = point.objects.filter(image_id__exact=self.kwargs['pk'])
        return queryset


class ImageView(RetrieveAPIView):
    serializer_class = ImageSerializer
    def get_queryset(self):
        queryset = image.objects.filter(id__exact=self.kwargs['pk'])
        return queryset


class PatientImagesListView(ListAPIView):
    serializer_class = ImageSerializer
    # permission_classes = [IsOwner]
    # lookup_url_kwarg = ['image-id']
    def get_queryset(self):
        queryset = image.objects.filter(patient_id__exact=self.kwargs['pk'])
        return queryset

class pointViewset(viewsets.ModelViewSet):
    queryset = point.objects.all()
    serializer_class = PointSerializer

class AddPointsView(RetrieveUpdateDestroyAPIView):

    serializer_class = PointSerializer
    lookup_field = 'id'
    # lookup_url_kwarg = ''
    # def get_queryset(self):
    #     queryset = point.objects.filter(image_id__exact=self.kwargs['id'])
    #     return queryset

    serializer_class = PointSerializer
    

    def get_queryset(self):
        queryset = point.objects.filter(image__id__exact=self.kwargs['id'])
        return(queryset)

    def update(self, request    , *args, **kwargs):
        queryset = point.objects.filter(image__id__exact=self.kwargs['id'])
        serializer = PointSerializer(queryset, data=request.data,)
        serializer.is_valid(raise_exception=True)
        print(serializer)
        serializer.save()


class DeletePointsView(DestroyAPIView):
    queryset = image.objects.all()
    serializer_class = PointSerializer
    lookup_field = 'id'

class PatientsListView(ListAPIView):
    serializer_class = InfoSerializer
    # lookup_url_kwarg = ''
    def get_queryset(self):
        queryset = info.objects.filter(doctor_id__exact=self.request.user)
        return queryset







# @api_view(['GET',])
# @permission_classes((IsAuthenticated,))
# def patient_list(request):
#     try:
#         patients_info = info.objects.filter(doctor_id__exact=request.user)
#     except info.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     serializer = infoSerializer(patients_info, many=True)
#     return Response(serializer.data)


# @api_view(['PUT',])
# @permission_classes((IsAuthenticated,))
# def add_points(request, pk):

#     try:
#         point = point.objects.get(pk=pk)
#     except Snippet.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)


#     if request.method == 'PUT':
#         serializer = pointSerializer(point, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#     try:
#         patients_info = info.objects.filter(doctor_id__exact=request.user)
#     except info.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     name = request.data['name']
#     patients_info = info.objects.filter(name__exact=name)


#     serializer = infoSerializer(patients_info, data=request.data)
#     data = {}
#     if serializer.is_valid():
#         serializer.save()
#         data['success'] = 'added successfuly'
#         return Response(data=data)

#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['GET',])
# def get_points(request, pk):

#     try:
#         image_points = point.objects.filter(pk=pk)
#     except info.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     # name = patient_info.name
#     serializer = pointSerializer(image_points)
#     return Response(serializer.data)


# @api_view(['GET',])
# def get_image(request, id):

#     try:
#         image = image.objects.filter(id=id)
#     except info.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     serializer = imageSerializer(image)
#     return Response(serializer.data)