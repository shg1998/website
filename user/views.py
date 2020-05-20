from django.urls import reverse
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.views.generic import DeleteView, DetailView, UpdateView
from .models import UserProfile


class ProfileDetailView(LoginRequiredMixin, UserPassesTestMixin, DetailView):
    model = UserProfile

    def test_func(self):
        profile = self.get_object()
        if profile.user_prof == self.request.user:
            return True
        return False


def register(request):
    from django.shortcuts import render, redirect
    from django.contrib import messages
    from .forms import UserRegisterForm

    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, f'Your account has been created! You are now able to log in')
            return redirect('login')
    else:
        form = UserRegisterForm()
    return render(request, 'user/userprofile_form.html', {'form': form})


class ProfileUpdateView(LoginRequiredMixin, SuccessMessageMixin, UserPassesTestMixin, UpdateView):
    model = UserProfile
    success_message = "patient updated successfully"
    fields = ['name_pati', 'description_pati']

    def form_valid(self, form):
        form.instance.doctor_pati = self.request.user
        return super().form_valid(form)

    def test_func(self):
        patient = self.get_object()
        if patient.doctor_pati == self.request.user:
            return True
        return False


class ProfileDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = UserProfile

    def get_success_url(self):
        return reverse('patient-create')

    def test_func(self):
        patient = self.get_object()
        if patient.doctor_pati == self.request.user:
            return True
        return False