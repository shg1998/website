from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.views.generic import DeleteView, DetailView, UpdateView
from .models import UserProfile, Hospital


class ProfileDetailView(LoginRequiredMixin, DetailView):
    model = UserProfile

    def get_object(self, queryset=None):
        return UserProfile.objects.filter(user_prof=self.request.user).get()


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
    success_message = "profile updated successfully"
    fields = ['name_prof', 'image_prof', 'hosp_prof']

    def get_object(self, queryset=None):
        return UserProfile.objects.filter(user_prof=self.request.user).get()

    def test_func(self):
        profile = self.get_object()
        if profile.user_prof == self.request.user:
            return True
        return False


class UserDeleteView(LoginRequiredMixin, DeleteView):
    model = User
    template_name = "user/user_confirm_delete.html"

    def get_object(self, queryset=None):
        return self.request.user

    def get_success_url(self):
        return reverse('base-home')


# ********* ImagesViews bellow *********
class HospitalDetailView(LoginRequiredMixin, DetailView):
    model = Hospital

    def get_object(self):
        object=UserProfile.objects.filter(user_prof=self.request.user).get().hosp_prof.all()[self.kwargs["hospital_id"]]
        self.pk=object.pk
        return object
