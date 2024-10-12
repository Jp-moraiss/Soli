from django.urls import path
from . import views

app_name = 'app_soli'  # Define o namespace

urlpatterns = [
    path('', views.home, name='home'),
    path('add/', views.add, name='add'),
    path('excluir/<int:lembrete_id>/', views.excluir_lembrete, name='excluir_lembrete'),
]
