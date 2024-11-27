from django.db import models
from datetime import timedelta, date
from django.templatetags.static import static

class Reminder(models.Model):
    text = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)

    def _str_(self):
        return self.text

class Cultura(models.Model):
    nome = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    linha = models.CharField(max_length=100, null=True)
    descricao = models.TextField(blank=True, null=True)
    data_plantio = models.DateField()
    data_colheita = models.DateField()
    duracao = models.IntegerField()
    unidade_duracao = models.CharField(max_length=10)

    def get_imagem_url(self):
        nome_imagem = self.nome.lower().replace(' ', '_')
        return static(f'img/{nome_imagem}.png')
    
    def __str__(self):
        return self.nome

class Atividade(models.Model):
    cultura = models.ForeignKey(Cultura, on_delete=models.CASCADE, related_name='atividades')
    nome = models.CharField(max_length=100)
    frequencia = models.IntegerField()
    unidade_frequencia = models.CharField(max_length=10, choices=[('dias', 'dias'), ('semanas', 'semanas'), ('meses', 'meses'), ('anos', 'anos')])
    data_proxima = models.DateField()

    def __str__(self):
        return f"{self.nome} - {self.cultura.nome}"

    def calcular_proxima_data(self):
        if self.unidade_frequencia == 'dias':
            return self.data_proxima + timedelta(days=self.frequencia)
        elif self.unidade_frequencia == 'semanas':
            return self.data_proxima + timedelta(weeks=self.frequencia)
        elif self.unidade_frequencia == 'meses':
            return self.data_proxima.replace(month=self.data_proxima.month + self.frequencia)
        elif self.unidade_frequencia == 'anos':
            return self.data_proxima.replace(year=self.data_proxima.year + self.frequencia)

