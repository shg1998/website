from django.shortcuts import render
from patient.models import info


def dashboard(request):

    return render(request,
                  template_name='page.html',)