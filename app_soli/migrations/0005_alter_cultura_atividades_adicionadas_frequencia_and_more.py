from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('app_soli', '0004_cultura_atividades_adicionadas_frequencia_and_more'),
    ]

    operations = [
        # Primeiro, altere os campos para TextField temporariamente
        migrations.AlterField(
            model_name='cultura',
            name='atividades_adicionadas_frequencia',
            field=models.TextField(blank=True, default='[]'),
        ),
        migrations.AlterField(
            model_name='cultura',
            name='atividades_adicionadas_nome',
            field=models.TextField(blank=True, default='[]'),
        ),
        migrations.AlterField(
            model_name='cultura',
            name='atividades_adicionadas_unidade',
            field=models.TextField(blank=True, default='[]'),
        ),
        # Em seguida, altere os campos para JSONField
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
