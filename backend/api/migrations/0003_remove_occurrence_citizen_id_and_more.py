# Generated by Django 4.2.2 on 2023-06-29 21:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_citizen_points_occurrence_priority'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='occurrence',
            name='citizen_id',
        ),
        migrations.AddField(
            model_name='occurrence',
            name='citizen_email',
            field=models.EmailField(default='a@ds', max_length=254),
        ),
    ]