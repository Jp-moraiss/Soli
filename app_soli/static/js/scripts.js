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
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    fetchWeather(latitude, longitude);
}

function error() {
    console.error('Erro ao obter localização.');
    document.getElementById('location').textContent = 'Erro ao obter localização.';
}

function fetchWeather(latitude, longitude) {
    const apiKey = 'ac658cc9736043449d253857241310'; // Substitua pela sua chave da WeatherAPI
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&lang=pt`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const current = data.current;
            const forecast = data.forecast.forecastday[0].hour; // Previsão horária do dia atual

            // Atualiza as informações do clima atual
            document.getElementById('location').textContent = `Localização: ${data.location.name}`;
            document.getElementById('temperature').textContent = `Temperatura: ${current.temp_c}°C`;
            document.getElementById('humidity').textContent = `Umidade: ${current.humidity}%`;
            document.getElementById('precipitation').textContent = `Condição: ${current.condition.text}`;

            // Atualiza as previsões das próximas 24 horas
            const forecastContainer = document.getElementById('hourly-forecast');
            forecastContainer.innerHTML = ''; // Limpa previsões anteriores

            const now = new Date();
            let hourCount = 0;

            forecast.forEach(hourData => {
                const forecastTime = new Date(hourData.time);
                if (forecastTime > now && hourCount < 24) {
                    const hourElement = document.createElement('div');
                    hourElement.className = 'hour';
                    hourElement.innerHTML = `
                        ${forecastTime.getHours()}:00<br>
                        ${hourData.temp_c}°C
                    `;
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
        }

        // Adiciona os dias à data de plantio
        plantioDate.setDate(plantioDate.getDate() + diasParaAdicionar);
        dataColheitaField.value = plantioDate.toISOString().substring(0, 10);
    }
}

function calcularDuracao() {
    const dataPlantio = document.getElementById('data_plantio').value;
    const dataColheita = document.getElementById('data_colheita').value;
    const duracaoField = document.getElementById('duracao');

    if (dataPlantio && dataColheita) {
        const plantioDate = new Date(dataPlantio);
        const colheitaDate = new Date(dataColheita);

        // Calcula a diferença em dias
        const diffTime = Math.abs(colheitaDate - plantioDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        duracaoField.value = diffDays;
    }
}

// Inicia a função de busca de clima e configura os ouvintes de evento
document.addEventListener('DOMContentLoaded', function () {
    getWeather();

    // Adiciona os ouvintes de evento para os campos de entrada
    document.getElementById('data_plantio').addEventListener('change', calcularDataColheita);
    document.getElementById('duracao').addEventListener('input', calcularDataColheita);
    document.getElementById('data_colheita').addEventListener('change', calcularDuracao);
});

// Função para gerenciar as mensagens
document.addEventListener('DOMContentLoaded', function () {
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
