from django.db import models

class Commitment(models.Model):
    time_start = models.DateTimeField()
    time_end = models.DateTimeField(null=True, blank=True)  # Hora de fim é opcional
    processes = models.CharField(max_length=200, default="My default process")
    location = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)  # Descrição é opcional

    def __str__(self):
        return self.processes
