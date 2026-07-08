from django.contrib import admin
from django.urls import path
from varu import views

urlpatterns = [
    path("healthz/", views.healthz),
    path('control-panel-secure-dashboard/', admin.site.urls),
    path('', views.homepage, name='home'),
    path('mission/', views.mission, name='mission'),
    path('transportation/', views.transportation, name='transportation'),
    path('education/', views.education, name='education'),
    path('health/', views.health, name='health'),
    path('donate/', views.donate, name='donate'),
    path('contact/', views.contactus, name='contactus'),
    path('team/', views.team, name='team'),
    path('transparency/', views.transparency, name='transparency'),
    path('expenses/', views.expenses, name='expenses')
]
