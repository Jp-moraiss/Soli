from django.shortcuts import render, redirect, get_object_or_404
from .models import Reminder

def home(request):
    if request.method == 'POST':
        text = request.POST.get('text')
        if text:
            Reminder.objects.create(text=text)
        return redirect('app_soli:home')


    reminders = Reminder.objects.all()
    return render(request, 'home.html', {'reminders': reminders})

def add(request):
    return render(request, 'add.html')

# Nova função para excluir lembretes
def excluir_lembrete(request, lembrete_id):
    lembrete = get_object_or_404(Reminder, id=lembrete_id)
    lembrete.delete()
    return redirect('app_soli:home')