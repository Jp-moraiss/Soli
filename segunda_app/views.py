from django.shortcuts import render, redirect, get_object_or_404
from datetime import datetime
from django.utils import timezone
from .models import Commitment
import json
from django.http import JsonResponse, HttpResponseBadRequest
import pytz
from django.urls import reverse

def render_calendar(request):
    # Obtenha todas as datas dos compromissos usando o campo 'date'
    compromissos = Commitment.objects.values_list('date', flat=True)
    
    # Converta para uma lista de strings no formato "YYYY-MM-DD"
    datas_com_compromissos = [comp.isoformat() for comp in compromissos]
    
    context = {
        'datas_com_compromissos': json.dumps(datas_com_compromissos)  # Passa como JSON
    }
    return render(request, "segunda_app/calendar_page.html", context)

def add_commitment(request):
    if request.method == 'POST':
        date_str = request.POST.get('date')
        try:
            date_obj = datetime.strptime(date_str, '%d/%m/%Y').date()
            description = request.POST.get('description')

            Commitment.objects.create(
                date=date_obj,
                description=description
            )
            return redirect('agenda')
        except ValueError:
            return render(request, "segunda_app/add_commitment_page.html", {
                'selected_date': date_str,
                'error': 'Formato de data inválido. Tente novamente.',
                'description': request.POST.get('description'),
                'form_action': reverse('adicionar_compromisso'),
            })
    else:
        date_str = request.GET.get('date')
        return render(request, "segunda_app/add_commitment_page.html", {
            'selected_date': date_str,
            'form_action': reverse('adicionar_compromisso')
        })

def edit_commitment(request, comp_id):
    # Tenta obter o compromisso; caso contrário, mostra uma mensagem de erro.
    commitment = get_object_or_404(Commitment, id=comp_id)

    if request.method == 'POST':
        date_str = request.POST.get('date')
        try:
            # Converte a data para o formato adequado
            date_obj = timezone.datetime.strptime(date_str, '%d/%m/%Y').date()

            # Atualiza o compromisso com os novos valores
            commitment.date = date_obj
            commitment.description = request.POST['description']
            commitment.save()
            return redirect('agenda')
        except ValueError:
            # Retorna ao formulário em caso de erro com os valores submetidos
            return render(request, "segunda_app/add_commitment_page.html", {
                'selected_date': date_str,
                'commitment': commitment,
                'error': 'Formato de data inválido. Tente novamente.',
                'form_action': reverse('editar_compromisso', args=[comp_id]),
                'description': request.POST.get('description')
            })
    else:
        # Preenche o formulário com os dados existentes
        context = {
            'selected_date': commitment.date.strftime('%d/%m/%Y'),
            'description': commitment.description,
            'form_action': reverse('editar_compromisso', args=[comp_id]),
            'commitment': commitment
        }
        return render(request, "segunda_app/add_commitment_page.html", context)

def get_commitments_by_date(request):
    date_str = request.GET.get('date')
    if not date_str:
        return JsonResponse({'error': 'Data não fornecida'}, status=400)
    
    try:
        date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return JsonResponse({'error': 'Formato de data inválido'}, status=400)
    
    compromissos = Commitment.objects.filter(date=date_obj).order_by('date')

    compromissos_data = [
        {
            'description': comp.description,
            'id': comp.id
        } for comp in compromissos
    ]
    
    return JsonResponse({'compromissos': compromissos_data})


def delete_commitment(request, comp_id):
    if request.method == 'POST':  # Altere DELETE para POST
        try:
            # Obtém o compromisso a ser excluído
            commitment = Commitment.objects.get(id=comp_id)
            commitment.delete()  # Deleta o compromisso
            return JsonResponse({'success': True}, status=204)  # Retorna sucesso
        except Commitment.DoesNotExist:
            return JsonResponse({'error': 'Compromisso não encontrado'}, status=404)
    else:
        return HttpResponseBadRequest('Método não permitido')
