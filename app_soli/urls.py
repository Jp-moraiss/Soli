from django.urls import path
from . import views

app_name = 'app_soli'

urlpatterns = [
    path('', views.login_view, name='login'),  # Página de login
    path('cadastro/', views.cadastro_view, name='cadastro'),  # Página de cadastro
    path('home/', views.home, name='home'),  # Página principal com lembretes
    path('add/', views.add, name='add'),  # Página para adicionar novas culturas
    path('verculturas/', views.verculturas, name='verculturas'),  # Página para visualizar culturas
    path('excluir/<int:lembrete_id>/', views.excluir_lembrete, name='excluir_lembrete'),  # Excluir lembrete
    path('excluir_cultura/<int:cultura_id>/', views.excluir_cultura, name='excluir_cultura'),  # Excluir cultura
    path('weather/', views.weather, name='weather'),  # Página para o clima
]
