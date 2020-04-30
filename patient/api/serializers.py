from rest_framework import serializers

from patient.models import info, image, point

class InfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = info
        fields = [  'name',
                    'doctor',
                    'imaging_center',
                ]


class PointSerializer(serializers.ModelSerializer):
    class Meta:
        model = point
        fields = [
            'point',
        ]


class PointUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = point    


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = image
        fields = [
            'patient',
            'document',
        ]