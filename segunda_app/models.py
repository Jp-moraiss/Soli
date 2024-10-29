from django.db import models
from django.utils import timezone

class Commitment(models.Model):
    description = models.TextField(default="Descrição padrão")  # Define um valor padrão
    date = models.DateField(default=timezone.now)


    def __str__(self):
        return self.description or "Compromisso sem descrição"
