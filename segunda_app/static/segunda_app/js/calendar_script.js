document.addEventListener("DOMContentLoaded", function() {
    const commitmentsDiv = document.querySelector("#commitments");
    let selectedDateISO = null;

    function loadCommitments(dateStr) {
        fetch(`/agenda/get_commitments/?date=${dateStr}`)
            .then(response => response.json())
            .then(data => {
                commitmentsDiv.innerHTML = '';
                if (data.compromissos && data.compromissos.length > 0) {
                    renderCommitments(data.compromissos);
                } else {
                    commitmentsDiv.innerHTML = '<p>Nenhuma anotação para esse dia.</p>';
                }
            })
            .catch(error => {
                console.error('Erro ao carregar compromissos:', error);
                commitmentsDiv.innerHTML = '<p>Ocorreu um erro ao carregar as anotações.</p>';
            });
    }

    function renderCommitments(compromissos) {
        compromissos.forEach(comp => {
            const commitmentItem = document.createElement("div");
            commitmentItem.className = 'commitment-item';
            commitmentItem.innerHTML = `
            <strong class='descricao'>${comp.description}</strong><br>
            <div class = 'div_botoes'>
            <button class="edit-button" data-id="${comp.id}">Editar</button>
            <button class="delete-button" data-id="${comp.id}">Excluir</button>
            </div>
            `;
            commitmentsDiv.appendChild(commitmentItem);
        });

        commitmentsDiv.style.overflowY = 'auto';
        // Adiciona evento de clique para cada botão de excluir
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', function() {
                const compId = this.getAttribute('data-id'); // Obtém o ID do compromisso
                deleteCommitment(compId); // Chama a função para deletar o compromisso
            });
        });
    
        // Adiciona evento de clique para cada botão de editar
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', function() {
                const compId = this.getAttribute('data-id'); // Obtém o ID do compromisso
                // Redireciona para a página de edição
                window.location.href = `/agenda/editar_compromisso/${compId}/`;
            });
        });
    }


    function deleteCommitment(compId) {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
        fetch(`/agenda/delete_commitment/${compId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            }
        })
        .then(response => {
            if (response.ok) {
                // Atualiza a página automaticamente
                location.reload(); // Isso vai recarregar a página
            } else {
                return response.json().then(err => {
                    console.error('Erro ao excluir o compromisso:', err.error);
                    alert(`Erro: ${err.error}`);
                });
            }
        })
        .catch(error => {
            console.error('Erro ao fazer a requisição para excluir o compromisso:', error);
        });
    }
    
    
    // Função para remover o marcador de evento (bolinha verde) do calendário
    function removeEventMarker(dateStr) {
        const dayElements = document.querySelectorAll('.flatpickr-day');
        dayElements.forEach(dayElem => {
            const dayDateStr = dayElem.dateObj.toISOString().split('T')[0];
            if (dayDateStr === dateStr) {
                const eventMarker = dayElem.querySelector('.event-marker');
                if (eventMarker) {
                    eventMarker.remove(); // Remove o marcador de evento
                }
            }
        });
    }
    

    // Configura o calendário flatpickr
    const calendar = flatpickr("#datepicker", {
        locale: "pt",              // Idioma para português
        dateFormat: "d/m/Y",       // Formato da data
        inline: true,              // Exibe o calendário inline (não em modal)
        defaultDate: "today",      // Data padrão (hoje)
        firstDayOfWeek: 1,         // Começa a semana na segunda-feira
        onDayCreate: function(dObj, dStr, fp, dayElem) {
            const dateStr = dayElem.dateObj.toISOString().split('T')[0];  // 'YYYY-MM-DD'

            if (datasComCompromissos.includes(dateStr)) {
                const eventMarker = document.createElement('div');
                eventMarker.className = 'event-marker';  // Classe do marcador de evento
                dayElem.appendChild(eventMarker);
            }

            // Adiciona o listener de clique no próprio dia
            dayElem.addEventListener("click", function() {
                selectedDateISO = dateStr; // Atualiza a data selecionada
                loadCommitments(dateStr);  // Carrega compromissos quando o dia é clicado
            });
        }
    });
})
