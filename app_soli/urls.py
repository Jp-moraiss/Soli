from django.urls import path
from . import views

app_name = 'app_soli'

urlpatterns = [
    path('', views.home, name='home'),
    path('add/', views.add, name='add'),
    path('verculturas/', views.verculturas, name='verculturas'),
    path('excluir/<int:lembrete_id>/', views.excluir_lembrete, name='excluir_lembrete'),
]