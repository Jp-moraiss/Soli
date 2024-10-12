from django.shortcuts import render,redirect
from .models import Reminder

# Create your views here.

def home(request):
    # Se for uma requisição POST (quando o usuário envia um lembrete novo)
    if request.method == 'POST':
        text = request.POST.get('text')  # Pega o valor do campo de texto do formulário
        if text:  # Verifica se o texto não está vazio
            Reminder.objects.create(text=text)  # Cria o novo lembrete no banco de dados
        return redirect('home')  # Redireciona para a página principal após salvar o lembrete

    # Se for uma requisição GET (para exibir a página)
    reminders = Reminder.objects.all()  # Pega todos os lembretes do banco de dados
    return render(request, 'home.html', {'reminders': reminders})

def add(request):
    return render(request, 'add.html')
