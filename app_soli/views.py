from django.shortcuts import render, redirect, get_object_or_404
from .models import Reminder, Cultura, Atividade, DiarioNota
from django.contrib import messages
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from datetime import datetime, date, timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.utils import timezone
from django.db.models import Count
from django.conf import settings
from django.core.exceptions import PermissionDenied


def home(request):
    if request.method == 'POST':
        text = request.POST.get('text')
        if text:
            if Reminder.objects.filter(text=text).exists():
                messages.error(request, 'Este lembrete já foi adicionado.')
            else:
                Reminder.objects.create(text=text)
                messages.success(request, 'Lembrete adicionado com sucesso.')
        return redirect('app_soli:home')

    reminders = Reminder.objects.all()
    atividades = Atividade.objects.all()
    lembretes_atividades = []

    for atividade in atividades:
        lembretes_atividades.append(atividade)  # Adiciona a atividade ao invés de uma string
        # Atualiza a data da próxima atividade
        if atividade.data_proxima <= timezone.now().date():
            if atividade.unidade_frequencia == 'dias':
                atividade.data_proxima += timedelta(days=atividade.frequencia)
            elif atividade.unidade_frequencia == 'semanas':
                atividade.data_proxima += timedelta(weeks=atividade.frequencia)
            elif atividade.unidade_frequencia == 'meses':
                next_month = atividade.data_proxima.month + atividade.frequencia
                year = atividade.data_proxima.year + next_month // 12
                month = next_month % 12 or 12
                atividade.data_proxima = atividade.data_proxima.replace(year=year, month=month)
            elif atividade.unidade_frequencia == 'anos':
                atividade.data_proxima = atividade.data_proxima.replace(year=atividade.data_proxima.year + atividade.frequencia)
            atividade.save()

    return render(request, 'home.html', {
        'reminders': reminders,
        'lembretes_atividades': lembretes_atividades
    })




def add(request):
    if request.method == 'POST':
        nome = request.POST.get('cultura')
        area = request.POST.get('area')
        linha = request.POST.get('linha')
        descricao = request.POST.get('descricao', '')
        data_plantio = request.POST.get('data_plantio')
        data_colheita = request.POST.get('data_colheita')
        duracao = request.POST.get('duracao')
        unidade_duracao = request.POST.get('unidade_duracao')

        # Obter atividades personalizadas do usuário
        atividades_personalizadas_nome = request.POST.getlist('nova_atividade_nome[]')
        atividades_personalizadas_frequencia = request.POST.getlist('nova_atividade_frequencia[]')
        atividades_personalizadas_unidade = request.POST.getlist('nova_atividade_unidade[]')

        if not all([nome, area, linha, data_plantio, data_colheita, duracao, unidade_duracao]):
            messages.error(request, 'Por favor, preencha todos os campos obrigatórios.')
            return redirect('app_soli:add')

        try:
            data_plantio = datetime.strptime(data_plantio, '%Y-%m-%d')
            data_colheita = datetime.strptime(data_colheita, '%Y-%m-%d')
        except ValueError:
            messages.error(request, 'Formato de data inválido. Use AAAA-MM-DD.')
            return redirect('app_soli:add')

        if data_plantio >= data_colheita:
            messages.error(request, 'A data de plantio deve ser anterior à data de colheita.')
            return redirect('app_soli:add')

        # Criação da cultura
        cultura = Cultura.objects.create(
            nome=nome,
            area=area,
            linha=linha,
            descricao=descricao or None,
            data_plantio=data_plantio,
            data_colheita=data_colheita,
            duracao=duracao,
            unidade_duracao=unidade_duracao
        )

        # Criação das atividades automáticas para irrigação e poda
        irrigacao_frequencia = request.POST.get('irrigacao_frequencia')
        irrigacao_unidade = request.POST.get('irrigacao_unidade')

        if irrigacao_frequencia and irrigacao_unidade:
            Atividade.objects.create(
                cultura=cultura,
                nome="Irrigação",
                frequencia=int(irrigacao_frequencia),
                unidade_frequencia=irrigacao_unidade,
                data_proxima=data_plantio
            )

        poda_frequencia = request.POST.get('poda_frequencia')
        poda_unidade = request.POST.get('poda_unidade')

        if poda_frequencia and poda_unidade:
            Atividade.objects.create(
                cultura=cultura,
                nome="Poda",
                frequencia=int(poda_frequencia),
                unidade_frequencia=poda_unidade,
                data_proxima=data_plantio
            )

        # Adicionar atividades personalizadas, se houver
        for nome, frequencia, unidade in zip(atividades_personalizadas_nome, atividades_personalizadas_frequencia, atividades_personalizadas_unidade):
            if nome.strip():  # Verifica se a atividade não está vazia
                Atividade.objects.create(
                    cultura=cultura,
                    nome=nome,
                    frequencia=int(frequencia),
                    unidade_frequencia=unidade,
                    data_proxima=data_plantio
                )

        messages.success(request, 'Cultura e atividades adicionadas com sucesso.')
        return redirect('app_soli:home')

    return render(request, 'add.html')



def calcular_progresso(data_plantio, data_colheita):
    if isinstance(data_plantio, (date, datetime)) and isinstance(data_colheita, (date, datetime)):
        if isinstance(data_plantio, date) and not isinstance(data_plantio, datetime):
            data_plantio = datetime.combine(data_plantio, datetime.min.time())
        if isinstance(data_colheita, date) and not isinstance(data_colheita, datetime):
            data_colheita = datetime.combine(data_colheita, datetime.min.time())

        data_atual = datetime.now()

        # Calcula a duração total em dias até a colheita
        duracao_total = (data_colheita - data_plantio).days

        if duracao_total > 0:
            # Calcula quantos dias faltam para a colheita
            dias_restantes = (data_colheita - data_atual).days

            if dias_restantes < 0:
                return 100  # A barra deve estar cheia após o dia da colheita

            # Se for o dia da colheita
            if dias_restantes == 0:
                return 100

            # Se for o dia antes da colheita, retorna 99.9%
            if dias_restantes == 1:
                return 99.9

            # Calcula o progresso em relação aos dias restantes
            progresso = ((duracao_total - dias_restantes - 1) / duracao_total) * 100

            return round(max(0, progresso), 2)

    return 0  # Se as datas não forem válidas

def calcular_tempo_restante(data_colheita):
    if isinstance(data_colheita, (date, datetime)):
        if isinstance(data_colheita, date) and not isinstance(data_colheita, datetime):
            data_colheita = datetime.combine(data_colheita, datetime.min.time())

        data_atual = datetime.now()
        data_atual = datetime.combine(data_atual.date(), datetime.min.time())

        dias_restantes = (data_colheita - data_atual).days

        if dias_restantes > 0:
            return f"{dias_restantes} dia(s)"
        elif dias_restantes == 0:
            return "Hoje"
        else:
            return "Colheita concluída"
    
    return "Data inválida"

def verculturas(request):
    data_atual = date.today()
    um_dia_antes = data_atual - timedelta(days=1)

    culturas = Cultura.objects.filter(data_colheita__gte=um_dia_antes)
    for cultura in culturas:
        cultura.progresso = calcular_progresso(cultura.data_plantio, cultura.data_colheita)
        cultura.tempo_restante = calcular_tempo_restante(cultura.data_colheita)
    context = {
        'culturas': culturas
    }
    return render(request, 'verculturas.html', context)


def excluir_cultura(request, cultura_id):
    cultura = get_object_or_404(Cultura, id=cultura_id)
    cultura.delete()
    messages.success(request, 'Cultura excluída com sucesso.')
    return redirect('app_soli:verculturas')

def weather(request):
    return render(request, 'weather.html')

def login(request):
    return render(request, 'login.html')

def excluir_lembrete(request, lembrete_id):
    lembrete = get_object_or_404(Reminder, id=lembrete_id)
    lembrete.delete()
    messages.success(request, 'Lembrete excluído com sucesso.')
    return redirect('app_soli:home')

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        senha = request.POST['senha']

        user = authenticate(request, username=username, password=senha)

        if user is not None:
            auth_login(request, user)
            messages.success(request, 'Login realizado com sucesso.') 
            return redirect('app_soli:home')
        else:
            messages.error(request, 'Usuário ou senha inválidos')
            print(f"Falha de login: username={username}, senha={senha}")
            return redirect('app_soli:login')

    return render(request, 'login.html')

def cadastro_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        senha = request.POST.get('senha')
        confirm_senha = request.POST.get('confirm_senha')

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Usuário já existe')
            return redirect('app_soli:cadastro')

        if senha != confirm_senha:
            messages.error(request, 'As senhas não coincidem')
            return redirect('app_soli:cadastro')

        user = User.objects.create_user(username=username, email=email, password=senha)
        user.is_active = True  # Garante que o usuário está ativo
        user.save()

        messages.success(request, 'Usuário criado com sucesso')
        return redirect('app_soli:login')

    return render(request, 'register.html')



from collections import defaultdict
from django.db.models import Count
from datetime import date

def procurar_linhas_view(request):
    linha_procurada = request.GET.get('linha', '')  # Recebe o valor da linha do campo de busca
    
    # Se `linha_procurada` estiver vazio, carregue todas as culturas. Caso contrário, filtre pela linha procurada.
    culturas = Cultura.objects.filter(linha__icontains=linha_procurada, data_colheita__gte=date.today()) if linha_procurada else Cultura.objects.filter(data_colheita__gte=date.today())

    # Agrupar as culturas por área e linha
    culturas_agrupadas = defaultdict(list)
    for cultura in culturas:
        cultura.progresso = calcular_progresso(cultura.data_plantio, cultura.data_colheita)
        cultura.tempo_restante = calcular_tempo_restante(cultura.data_colheita)
        key = f"{cultura.area}-{cultura.linha}"
        culturas_agrupadas[key].append(cultura)

    context = {
        'culturas': culturas,
        'culturas_agrupadas': dict(culturas_agrupadas),
        'linha': linha_procurada,
        'query': linha_procurada
    }
    return render(request, 'procurarlinha.html', context)


    
@csrf_exempt
def editar_cultura(request, id):
    if request.method == 'POST':
        try:
            dados = json.loads(request.body)
            cultura = Cultura.objects.get(id=id)
            cultura.area = dados.get('area', cultura.area)
            cultura.linha = dados.get('linha', cultura.linha)
            cultura.data_plantio = dados.get('data_plantio', cultura.data_plantio)
            cultura.data_colheita = dados.get('data_colheita', cultura.data_colheita)
            cultura.save()
            return JsonResponse({'success': True})
        except Cultura.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Cultura não encontrada'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Método inválido'})


def procurarlinha(request):
    return render(request, 'procurarlinha.html')

def meuhistorico(request):
    data_atual = date.today()
    um_dia_atras = data_atual - timedelta(days=1)

    # Filtrar culturas com data de colheita anterior ou igual a um dia atrás
    culturas = Cultura.objects.filter(data_colheita__lte=um_dia_atras).order_by('area', 'data_plantio')

    # Aplicar a busca, caso o parâmetro 'nome' seja fornecido
    search_query = request.GET.get('nome', '').lower()
    if search_query:
        culturas = culturas.filter(nome__icontains=search_query)

    # Adicionando imagens dinamicamente ao contexto
    culturas_com_imagens = [
        {
            'cultura': cultura,
            'imagem_url': cultura.get_imagem_url(),
        }
        for cultura in culturas
    ]

    return render(request, 'meuhistorico.html', {'culturas': culturas_com_imagens})

def cleanup_db(request):
    if not settings.DEBUG:
        raise PermissionDenied("O cleanup_db só pode ser executado em desenvolvimento ou testes.")


    try:
        Reminder.objects.all().delete()
        Atividade.objects.all().delete()
        Cultura.objects.all().delete()


        return JsonResponse({'status': 'success', 'message': 'Database cleaned'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

def diario_view(request):
    return render(request, 'diario.html')

@csrf_exempt
@csrf_exempt
def salvar_diario(request):
    if request.method == 'POST':
        data = request.POST.get('data')
        diario_nota = request.POST.get('diario_nota')
        foto = request.FILES.get('foto')
        # Criar uma nova entrada para cada nota
        DiarioNota.objects.create(data=data, nota=diario_nota, foto=foto)
        return redirect('app_soli:diario')
    return render(request, 'diario.html')

def fetch_note_for_date(request, date):
    notas = DiarioNota.objects.filter(data=date).order_by('timestamp')
    notas_list = [{'nota': nota.nota, 'foto': nota.foto.url if nota.foto else None} for nota in notas]
    return JsonResponse({'notas': notas_list})

def excluir_atividade(request, id):
    atividade = get_object_or_404(Atividade, id=id)
    atividade.delete()
    return redirect('app_soli:home')

    from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def salvar_atividade(request, id):
    if request.method == 'POST':
        data = json.loads(request.body)
        new_text = data.get('text').strip()
        if new_text == '':
            return JsonResponse({'success': False, 'error': 'O nome da atividade não pode estar vazio.'})

        atividade = Atividade.objects.get(id=id)
        atividade.nome = new_text
        atividade.save()
        return JsonResponse({'success': True})
    
    return JsonResponse({'success': False, 'error': 'Invalid request'}, status=400)

@csrf_exempt
def salvar_lembrete(request, id):
    if request.method == 'POST':
        data = json.loads(request.body)
        new_text = data.get('text').strip()
        if new_text == '':
            return JsonResponse({'success': False, 'error': 'O nome do lembrete não pode estar vazio.'})
        
        reminder = Reminder.objects.get(id=id)
        reminder.text = new_text
        reminder.save()
        return JsonResponse({'success': True})
    
    return JsonResponse({'success': False, 'error': 'Invalid request'}, status=400)


