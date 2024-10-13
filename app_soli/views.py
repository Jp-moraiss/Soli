from django.shortcuts import render, redirect, get_object_or_404
from .models import Reminder
from django.contrib import messages

def home(request):
    if request.method == 'POST':
        text = request.POST.get('text')
        if text:
            # Verifica se já existe um lembrete com o mesmo texto
            if Reminder.objects.filter(text=text).exists():
                messages.error(request, 'Este lembrete já foi adicionado.')
            else:
                Reminder.objects.create(text=text)
                messages.success(request, 'Lembrete adicionado com sucesso.')
        return redirect('app_soli:home')

    reminders = Reminder.objects.all()
    return render(request, 'home.html', {'reminders': reminders})

def add(request):
    return render(request, 'add.html')

def excluir_lembrete(request, lembrete_id):
    lembrete = get_object_or_404(Reminder, id=lembrete_id)
    lembrete.delete()
    return redirect('app_soli:home')