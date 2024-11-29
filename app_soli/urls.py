from django.urls import path
from . import views
from .views import editar_cultura, diario_view, salvar_diario, fetch_note_for_date, home, salvar_atividade, excluir_atividade, salvar_lembrete




app_name = 'app_soli'

urlpatterns = [
    path('', views.login_view, name='login'),  # Página de login
    path('cadastro/', views.cadastro_view, name='cadastro'),  # Página de cadastro
    path('home/', views.home, name='home'),  # Página principal com lembretes
    path('add/', views.add, name='add'),  # Página para adicionar novas culturas
    path('verculturas/', views.verculturas, name='verculturas'),  # Página para visualizar culturas
    path('excluir/<int:lembrete_id>/', views.excluir_lembrete, name='excluir_lembrete'),  # Excluir lembrete
    path('salvar_lembrete/<int:lembrete_id>/', views.salvar_lembrete, name='salvar_lembrete'),
    path('excluir_cultura/<int:cultura_id>/', views.excluir_cultura, name='excluir_cultura'),  # Excluir cultura
    path('weather/', views.weather, name='weather'),  # Página para o clima
    path('procurarlinha/', views.procurar_linhas_view, name='procurarlinha'),  # Página para procurar cultura por linha
    path('cultura/editar/<int:id>/', editar_cultura, name='editar_cultura'),
    path('meuhistorico/', views.meuhistorico, name='meuhistorico'),  # Página meu histórico
    path('cleanup_db/', views.cleanup_db, name='cleanup_db'), # Para limpar o banco de dados (testes)
    path('diario/', diario_view, name='diario'),
    path('salvar_diario/', salvar_diario, name='salvar_diario'),
    path('fetch_note_for_date/<str:date>/', fetch_note_for_date, name='fetch_note_for_date'),  # Add fetch_note_for_date path
    path('salvar_atividade/<int:id>/', salvar_atividade, name='salvar_atividade'),
    path('excluir_atividade/<int:id>/', excluir_atividade, name='excluir_atividade'),
    path('salvar_atividade/<int:id>/', salvar_atividade, name='salvar_atividade'),
]
