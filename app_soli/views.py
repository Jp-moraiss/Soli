from django.shortcuts import render, redirect, get_object_or_404
from .models import Reminder, Cultura
from django.contrib import messages
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from datetime import datetime, date

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
    return render(request, 'home.html', {'reminders': reminders})

def add(request):
    if request.method == 'POST':
        nome = request.POST.get('cultura')
        area = request.POST.get('area')
        linha = request.POST.get('linha')
        descricao = request.POST.get('descricao')
        data_plantio = request.POST.get('data_plantio')
        data_colheita = request.POST.get('data_colheita')
        duracao = request.POST.get('duracao')
        unidade_duracao = request.POST.get('unidade_duracao')
        irrigacao_frequencia = request.POST.get('irrigacao_frequencia')
        irrigacao_unidade = request.POST.get('irrigacao_unidade')
        poda_frequencia = request.POST.get('poda_frequencia')
        poda_unidade = request.POST.get('poda_unidade')

        if not all([nome, area, linha, descricao, data_plantio, data_colheita, duracao, unidade_duracao]):
            messages.error(request, 'Por favor, preencha todos os campos obrigatórios.')
            return redirect('app_soli:add')

        # Verifica se a data de plantio é anterior à data de colheita
        try:
            data_plantio = datetime.strptime(data_plantio, '%Y-%m-%d')
            data_colheita = datetime.strptime(data_colheita, '%Y-%m-%d')
        except ValueError:
            messages.error(request, 'Formato de data inválido. Use AAAA-MM-DD.')
            return redirect('app_soli:add')

        if data_plantio >= data_colheita:
            messages.error(request, 'A data de plantio deve ser anterior à data de colheita.')
            return redirect('app_soli:add')

        Cultura.objects.create(
            nome=nome,
            area=area,
            linha=linha,
            descricao=descricao,
            data_plantio=data_plantio,
            data_colheita=data_colheita,
            duracao=duracao,
            unidade_duracao=unidade_duracao,
            irrigacao_frequencia=irrigacao_frequencia,
            irrigacao_unidade=irrigacao_unidade,
            poda_frequencia=poda_frequencia,
            poda_unidade=poda_unidade
        )

        messages.success(request, 'Cultura adicionada com sucesso.')
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
    culturas = Cultura.objects.all()
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

        User.objects.create_user(username=username, email=email, password=senha)
        messages.success(request, 'Usuário criado com sucesso')
        return redirect('app_soli:login')

    return render(request, 'login.html')
