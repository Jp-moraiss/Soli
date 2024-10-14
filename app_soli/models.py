from django.db import models

class Reminder(models.Model):
    text = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)

    def _str_(self):
        return self.text
