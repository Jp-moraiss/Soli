from django.db import models

class Reminder(models.Model):
    text = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.text

class Cultura(models.Model):
    nome = models.CharField(max_length=100)
    area = models.CharField(max_length=100)  # Campo para Área
    linha = models.CharField(max_length=100, null=True)  # Permitir nulo temporariamente
    descricao = models.TextField()
    data_plantio = models.DateField()
    data_colheita = models.DateField()
    duracao = models.IntegerField()  # Duração em dias
    unidade_duracao = models.CharField(max_length=10)  # dias, semanas, meses, anos
    irrigacao_frequencia = models.IntegerField()
    irrigacao_unidade = models.CharField(max_length=10)
    poda_frequencia = models.IntegerField()
    poda_unidade = models.CharField(max_length=10)

    def __str__(self):
        return self.nome
