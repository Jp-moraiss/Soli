// Função para obter a localização do usuário e obter o clima atual
function getWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        console.error('Geolocalização não é suportada por este navegador.');
        document.getElementById('location').textContent = 'Erro ao obter localização.';
    }
}

function success(position) {
    const { latitude, longitude } = position.coords;
    fetchWeather(latitude, longitude);
}

function error() {
    console.error('Erro ao obter localização.');
    document.getElementById('location').textContent = 'Erro ao obter localização.';
}

function fetchWeather(latitude, longitude) {
    const apiKey = 'ac658cc9736043449d253857241310'; // Sua chave da WeatherAPI
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&lang=pt&hours=5`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const current = data.current;
            const forecast = data.forecast.forecastday[0].hour;

            // Atualiza as informações do clima atual
            document.getElementById('location').textContent = `Localização: ${data.location.name}`;
            document.getElementById('humidity').textContent = `Umidade: ${current.humidity}%`;
            document.getElementById('precipitation').textContent = `Condição: ${current.condition.text}`;

            // Atualiza as previsões das próximas 5 horas
            const forecastContainer = document.getElementById('hourly-forecast');
            forecastContainer.innerHTML = ''; // Limpa previsões anteriores

            const now = new Date();
            let hourCount = 0;

            forecast.forEach(hourData => {
                const forecastTime = new Date(hourData.time);
                if (forecastTime > now && hourCount < 5) {
                    const hourElement = document.createElement('div');
                    hourElement.className = 'hour';
                    hourElement.innerHTML = `
                        <ul class="ul_hour">
                            <li class="li_hour">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock">
                                    <circle cx="12" cy="12" r="10"/>
                                    <polyline points="12 6 12 12 16 14"/>
                                </svg> ${forecastTime.getHours()}:00
                            </li>
                            <li class="li_hour">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-sun">
                                    <path d="M12 2v2"/>
                                    <path d="m4.93 4.93 1.41 1.41"/>
                                    <path d="M20 12h2"/>
                                    <path d="m19.07 4.93-1.41 1.41"/>
                                    <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/>
                                    <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/>
                                </svg>
                            </li>
                            <li class="li_hour">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thermometer">
                                    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>
                                </svg> ${hourData.temp_c}°C
                            </li>
                        </ul>`;
                    forecastContainer.appendChild(hourElement);
                    hourCount++;
                }
            });
        })
        .catch(error => {
            console.error('Erro ao obter dados do clima:', error);
            document.getElementById('location').textContent = 'Erro ao obter dados do clima';
        });
}

// Funções para manter o estado da checkbox
function toggleStrike(checkbox) {
    const label = checkbox.nextElementSibling; // Pega o label ao lado da checkbox
    if (checkbox.checked) {
        label.style.textDecoration = 'line-through';
    } else {
        label.style.textDecoration = 'none';
    }
    // Salva o estado no localStorage
    localStorage.setItem(checkbox.id, checkbox.checked);
}

function loadCheckboxState() {
    const checkboxes = document.querySelectorAll('.reminder-checkbox');
    checkboxes.forEach(checkbox => {
        const isChecked = localStorage.getItem(checkbox.id) === 'true';
        checkbox.checked = isChecked;
        toggleStrike(checkbox);
    });
}

// Função para calcular o progresso
function calcularProgresso(dataPlantio, dataColheita) {
    const agora = new Date();
    const plantioDate = new Date(dataPlantio + 'T00:00:00'); // Ajuste aqui
    const colheitaDate = new Date(dataColheita + 'T00:00:00'); // Ajuste aqui

    // Calcula a diferença total em dias
    const totalDias = Math.ceil((colheitaDate - plantioDate) / (1000 * 60 * 60 * 24));
    const diasPassados = Math.ceil((agora - plantioDate) / (1000 * 60 * 60 * 24));

    // Calcula a porcentagem do progresso
    const progresso = Math.min((diasPassados / totalDias) * 100, 100); // Garante que não ultrapasse 100%
    return progresso;
}

// Inicia a função de busca de clima quando o conteúdo da página estiver carregado
document.addEventListener('DOMContentLoaded', function () {
    getWeather();
    loadCheckboxState(); // Carrega o estado das checkboxes

    // Adiciona os ouvintes de evento para os campos de entrada
    document.getElementById('data_plantio').addEventListener('change', calcularDataColheita);
    document.getElementById('duracao').addEventListener('input', calcularDataColheita);
    document.getElementById('data_colheita').addEventListener('change', calcularDuracao);

    // Função para gerenciar as mensagens
    const messages = document.querySelector('.messages');
    if (messages) {
        setTimeout(() => {
            messages.classList.add('show');
        }, 100); 

        setTimeout(() => {
            messages.classList.remove('show');
        }, 2000);
    }
});

// Funções para calcular a data de colheita e a duração
function calcularDataColheita() {
    const dataPlantio = document.getElementById('data_plantio').value;
    const duracao = document.getElementById('duracao').value;
    const unidade = document.getElementById('unidade_duracao').value;
    const dataColheitaField = document.getElementById('data_colheita');

    if (dataPlantio && duracao && unidade) {
        const plantioDate = new Date(dataPlantio);
        let diasParaAdicionar;

        // Define a quantidade de dias com base na unidade
        switch (unidade) {
            case 'dias':
                diasParaAdicionar = parseInt(duracao);
                break;
            case 'semanas':
                diasParaAdicionar = parseInt(duracao) * 7;
                break;
            case 'meses':
                plantioDate.setMonth(plantioDate.getMonth() + parseInt(duracao));
                dataColheitaField.value = plantioDate.toISOString().substring(0, 10);
                return; // Se for meses, retornamos aqui
            case 'anos':
                plantioDate.setFullYear(plantioDate.getFullYear() + parseInt(duracao));
                dataColheitaField.value = plantioDate.toISOString().substring(0, 10);
                return; // Se for anos, retornamos aqui
            default:
                return; // Se a unidade não for válida
        }

        // Adiciona os dias à data de plantio
        plantioDate.setDate(plantioDate.getDate() + diasParaAdicionar);
        dataColheitaField.value = plantioDate.toISOString().substring(0, 10);
    }
}

function calcularDuracao() {
    const dataColheita = document.getElementById('data_colheita').value;
    const dataPlantio = document.getElementById('data_plantio').value;
    const duracaoField = document.getElementById('duracao');

    if (dataColheita && dataPlantio) {
        const plantioDate = new Date(dataPlantio);
        const colheitaDate = new Date(dataColheita);
        
        // Calcula a diferença em dias
        const diffTime = Math.abs(colheitaDate - plantioDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        duracaoField.value = diffDays;
    }
}

function editarCultura(id) {
    const culturaCard = document.querySelector(`#cultura-${id}`);
    const nomeElement = culturaCard.querySelector('.cultura-nome');
    const areaElement = culturaCard.querySelector('.cultura-area');
    const linhaElement = culturaCard.querySelector('.cultura-linha');
    const dataPlantioElement = culturaCard.querySelector('.data-plantio');
    const dataColheitaElement = culturaCard.querySelector('.data-colheita');
    const confirmButton = culturaCard.querySelector('.confirmar-edicao');
    const editButton = culturaCard.querySelector('.editar-btn');

    if (nomeElement.isContentEditable) {
        // Salvar as alterações
        nomeElement.contentEditable = false;
        areaElement.contentEditable = false;
        linhaElement.contentEditable = false;
        dataPlantioElement.disabled = true;
        dataColheitaElement.disabled = true;

        // Remover a classe de edição
        nomeElement.classList.remove('editing');
        areaElement.classList.remove('editing');
        linhaElement.classList.remove('editing');
        dataPlantioElement.classList.remove('editing');
        dataColheitaElement.classList.remove('editing');

        // Coletar os dados
        const dados = {
            nome: nomeElement.innerText.split(' - ')[0],
            area: areaElement.innerText.split(': ')[1],
            linha: linhaElement.innerText.split(': ')[1],
            data_plantio: dataPlantioElement.value,
            data_colheita: dataColheitaElement.value
        };

        // Enviar os dados via AJAX
        fetch(`/cultura/editar/${id}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': '{{ csrf_token }}'
            },
            body: JSON.stringify(dados)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Cultura atualizada com sucesso!');

                // Atualizar os elementos no DOM com as novas informações
                nomeElement.innerText = `${dados.nome} - ${dados.data_plantio.split('-').reverse().join('/')}`;
                areaElement.innerText = `Área: ${dados.area}`;
                linhaElement.innerText = `Linhas: ${dados.linha}`;
                dataPlantioElement.value = dados.data_plantio;
                dataColheitaElement.value = dados.data_colheita;

                const tempoRestante = calcularTempoRestante(new Date(dados.data_colheita));
                culturaCard.querySelector('.tempo-restante').innerText = `Tempo restante: ${tempoRestante}`;
            } else {
                alert('Falha ao atualizar a cultura.');
            }
        });

        // Esconder o botão de confirmação e mostrar o de editar
        confirmButton.style.display = 'none';
        editButton.style.display = 'inline';
    } else {
        // Ativar a edição
        nomeElement.contentEditable = true;
        areaElement.contentEditable = true;
        linhaElement.contentEditable = true;
        dataPlantioElement.disabled = false;
        dataColheitaElement.disabled = false;

        // Adicionar a classe de edição
        nomeElement.classList.add('editing');
        areaElement.classList.add('editing');
        linhaElement.classList.add('editing');
        dataPlantioElement.classList.add('editing');
        dataColheitaElement.classList.add('editing');

        // Mostrar o botão de confirmação e esconder o de editar
        confirmButton.style.display = 'inline';
        editButton.style.display = 'none';
        nomeElement.focus();
    }
}

function calcularTempoRestante(dataColheita) {
    const agora = new Date();
    const diffTime = dataColheita - agora;
    const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diasRestantes >= 0) {
        return `${diasRestantes} dia(s)`;
    } else {
        return "Colheita concluída";
    }
}

function atualizarTempoRestante(culturaCard) {
    const dataColheitaElement = culturaCard.querySelector('.data-colheita');
    dataColheitaElement.addEventListener('change', function () {
        const tempoRestante = calcularTempoRestante(new Date(dataColheitaElement.value));
        culturaCard.querySelector('.tempo-restante').innerText = `Tempo restante: ${tempoRestante}`;
    });
}

// Função para filtrar as culturas
function filtrarCulturas() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const cards = document.querySelectorAll('.culturas-card');
    let hasResults = false;

    cards.forEach(card => {
        const nome = card.querySelector('.cultura-nome').innerText.toLowerCase();
        if (nome.includes(filter)) {
            card.style.display = ''; // Mostra a cultura
            hasResults = true;
        } else {
            card.style.display = 'none'; // Esconde a cultura
        }
    });

    // Exibe mensagem se não houver resultados
    document.getElementById('no-results').style.display = hasResults ? 'none' : 'block';
}

document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.culturas-card');
    cards.forEach(card => {
        atualizarTempoRestante(card);
    });

    // Adiciona o listener para a barra de pesquisa
    document.getElementById('searchInput').addEventListener('input', filtrarCulturas);
});

function confirmarExclusao() {
    return confirm("Tem certeza de que deseja excluir esta cultura?");
}

function adicionarCampoAtividade() {
    const atividadesContainer = document.querySelector('.atividades');

    // Cria um novo div para a nova atividade
    const novaAtividade = document.createElement('div');
    novaAtividade.classList.add('atv');

    novaAtividade.innerHTML = `
        <p>Nova Atividade:</p>
        <input type="text" name="nova_atividade_nome[]" placeholder="Nome da atividade" required>
        <p>A cada</p>
        <input type="number" name="nova_atividade_frequencia[]" placeholder="..." min="0" required>
        <select name="nova_atividade_unidade[]">
            <option value="dias">dias</option>
            <option value="semanas">semanas</option>
            <option value="meses">meses</option>
            <option value="anos">anos</option>
        </select>
    `;

    // Adiciona o novo campo de atividade ao container
    atividadesContainer.appendChild(novaAtividade);
}

function validateForm(event) {
    const dataPlantio = document.getElementById('data_plantio');
    const dataColheita = document.getElementById('data_colheita');

    if (dataPlantio.value) {
        dataPlantio.value = dataPlantio.valueAsDate.toISOString().split('T')[0];
    }
    if (dataColheita.value) {
        dataColheita.value = dataColheita.valueAsDate.toISOString().split('T')[0];
    }

    // Coleta dados das atividades
    const atividades = [];
    const novaAtividadeNomes = document.getElementsByName('nova_atividade_nome[]');
    const novaAtividadeFrequencias = document.getElementsByName('nova_atividade_frequencia[]');
    const novaAtividadeUnidades = document.getElementsByName('nova_atividade_unidade[]');

    for (let i = 0; i < novaAtividadeNomes.length; i++) {
        atividades.push({
            nome: novaAtividadeNomes[i].value,
            frequencia: novaAtividadeFrequencias[i].value,
            unidade: novaAtividadeUnidades[i].value
        });
    }

    // Cria um campo oculto para enviar as atividades em JSON
    const atividadesInput = document.createElement('input');
    atividadesInput.type = 'hidden';
    atividadesInput.name = 'atividades';
    atividadesInput.value = JSON.stringify(atividades);
    event.target.appendChild(atividadesInput);
}

document.addEventListener("DOMContentLoaded", function() {
    const messages = document.querySelector('.messages');

    if (messages) {
        // Espera 3 segundos antes de começar a desaparecer
        setTimeout(() => {
            messages.style.opacity = '0'; // Gradualmente esconde com transição

            // Remove o elemento após a transição terminar
            messages.addEventListener('transitionend', () => {
                messages.style.display = 'none';
            });
        }, 3000);
    }
});