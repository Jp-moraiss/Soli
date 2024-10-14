from django.shortcuts import render, redirect, get_object_or_404
from .models import Reminder, Cultura
from django.contrib import messages

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
        localizacao = request.POST.get('localizacao')
        descricao = request.POST.get('descricao')
        data_plantio = request.POST.get('data_plantio')
        data_colheita = request.POST.get('data_colheita')
        duracao = request.POST.get('duracao')
        unidade_duracao = request.POST.get('unidade_duracao')
        irrigacao_frequencia = request.POST.get('irrigacao_frequencia')
        irrigacao_unidade = request.POST.get('irrigacao_unidade')
        poda_frequencia = request.POST.get('poda_frequencia')
        poda_unidade = request.POST.get('poda_unidade')

        # Salvar a nova cultura
        Cultura.objects.create(
            nome=nome,
            localizacao=localizacao,
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

def excluir_lembrete(request, lembrete_id):
    lembrete = get_object_or_404(Reminder, id=lembrete_id)
    lembrete.delete()
    return redirect('app_soli:home')
