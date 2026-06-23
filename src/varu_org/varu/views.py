from django.shortcuts import render


def heropage(request):
    """Render the Varu hero page."""
    return render(request, 'varu/home.html')


def mission(request):
    """Render the Mission page."""
    return render(request, 'varu/mission.html', {'page_title': 'Our Mission'})


def who_we_are(request):
    """Render the Who We Are page."""
    return render(request, 'varu/who we are.html', {'page_title': 'Who We Are'})


def why_we_started(request):
    """Render the Why We Started page."""
    return render(request, 'varu/why we started.html', {'page_title': 'Why We Started'})


def health_deficiency(request):
    """Render the Health Deficiency page."""
    return render(request, 'varu/health defficiency.html', {'page_title': 'Health Deficiency'})


def donate(request):
    """Render the Donate page."""
    return render(request, 'varu/donate.html', {'page_title': 'Donate'})


def contactus(request):
    """Render the Contact Us page."""
    return render(request, 'varu/contactus.html', {'page_title': 'Contact Us'})
