# Generated by Django 5.1.1 on 2024-10-17 12:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_soli', '0004_cultura_atividades_adicionadas_frequencia_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cultura',
            name='atividades_adicionadas_frequencia',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AlterField(
            model_name='cultura',
            name='atividades_adicionadas_nome',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AlterField(
            model_name='cultura',
            name='atividades_adicionadas_unidade',
            field=models.JSONField(blank=True, default=list),
        ),
    ]