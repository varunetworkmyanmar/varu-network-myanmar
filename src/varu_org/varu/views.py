from django.shortcuts import render


def homepage(request):
    return render(request, 'varu/home.html')


def mission(request):
    return render(request, 'varu/mission.html')


def education(request):
    return render(request, 'varu/education.html')


def health(request):
    return render(request, 'varu/health.html')


def transportation(request):
    return render(request, 'varu/transportation.html')


def donate(request):
    return render(request, 'varu/donate.html')


def contactus(request):
    return render(request, 'varu/contactus.html')

def team(request):
    return render(request, 'varu/team.html')
