"""
URL configuration for varu_org project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from varu import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.heropage, name='heropage'),
    path('mission/', views.mission, name='mission'),
    path('who-we-are/', views.who_we_are, name='who_we_are'),
    path('why-we-started/', views.why_we_started, name='why_we_started'),
    path('health/', views.health_deficiency, name='health_deficiency'),
    path('donate/', views.donate, name='donate'),
    path('contact/', views.contactus, name='contactus'),
]
