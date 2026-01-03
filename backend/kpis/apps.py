from django.apps import AppConfig


class KpisConfig(AppConfig):
    name = 'kpis'
    default_auto_field = 'django.db.models.BigAutoField'
    
    def ready(self):
        """Import signals when app is ready"""
        import kpis.signals
