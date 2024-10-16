from django.shortcuts import render, redirect, get_object_or_404
from .models import Reminder, Cultura
from django.contrib import messages
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

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
        area = request.POST.get('area')  # Campo para Área
        linha = request.POST.get('linha')  # Campo para Linha
        descricao = request.POST.get('descricao')
        data_plantio = request.POST.get('data_plantio')
        data_colheita = request.POST.get('data_colheita')
        duracao = request.POST.get('duracao')
        unidade_duracao = request.POST.get('unidade_duracao')
        irrigacao_frequencia = request.POST.get('irrigacao_frequencia')
        irrigacao_unidade = request.POST.get('irrigacao_unidade')
        poda_frequencia = request.POST.get('poda_frequencia')
        poda_unidade = request.POST.get('poda_unidade')

        # Verificação se todos os campos obrigatórios foram preenchidos
        if not all([nome, area, linha, descricao, data_plantio, data_colheita, duracao, unidade_duracao]):
            messages.error(request, 'Por favor, preencha todos os campos obrigatórios.')
            return redirect('app_soli:add')

        # Salvar a nova cultura
        Cultura.objects.create(
            nome=nome,
            area=area,  # Armazenando a área
            linha=linha,  # Armazenando a linha
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

def verculturas(request):
    culturas = Cultura.objects.all()
    return render(request, 'verculturas.html', {'culturas': culturas})

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
            return redirect('app_soli:home')  # Redireciona para a página inicial após o login
        else:
            messages.error(request, 'Usuário ou senha inválidos')
            return redirect('app_soli:login')

    return render(request, 'login.html')


def cadastro_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        senha = request.POST.get('senha')

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Usuário já existe')
            return redirect('app_soli:cadastro')

        User.objects.create_user(username=username, email=email, password=senha)
        messages.success(request, 'Usuário criado com sucesso')
        return redirect('app_soli:login')

    return render(request, 'login.html')  # Retorna para o mesmo template de login para o cadastro