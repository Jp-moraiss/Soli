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

// Inicia a função de busca de clima quando o conteúdo da página estiver carregado
document.addEventListener('DOMContentLoaded', function () {
    getWeather();
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

    // Chamar a função para obter o clima
    getWeather();
});
