from django.contrib import admin
from django.urls import include, path  # Deve-se usar o include para incluir o urls.py das apps
from django.conf import settings
from django.conf.urls.static import static

# Aqui ficam todas as rotas do projeto
urlpatterns = [
    path('admin/', admin.site.urls),                        # 'admin/' = http://127.0.0.1:8000/admin/
    path('', include('app_soli.urls')),                     # Inclui as URLs da app 'app_soli' para a home page ('' = http://127.0.0.1:8000/)
    path('agenda/', include('segunda_app.urls')),           # Inclui as URLs da app ('agenda/' = http://127.0.0.1:8000/agenda/)
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
