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
    const apiKey = 'ac658cc9736043449d253857241310'; // Sua chave aqui
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&lang=pt`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const temperature = data.current.temp_c;
            const humidity = data.current.humidity;
            const condition = data.current.condition.text;
            const location = data.location.name;

            document.getElementById('location').textContent = `Localização: ${location}`;
            document.getElementById('temperature').textContent = `Temperatura: ${temperature}°C`;
            document.getElementById('humidity').textContent = `Umidade: ${humidity}%`;
            document.getElementById('precipitation').textContent = `Condição: ${condition}`;
        })
        .catch(error => {
            console.error('Erro ao obter dados do clima:', error);
            document.getElementById('location').textContent = 'Erro ao obter dados do clima';
        });
}

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
