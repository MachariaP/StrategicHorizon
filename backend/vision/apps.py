from django.apps import AppConfig


class VisionConfig(AppConfig):
    name = 'vision'
    
    def ready(self):
        import vision.signals  # noqa
