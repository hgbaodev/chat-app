import os
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from channels_auth_token_middlewares.middleware import SimpleJWTAuthTokenMiddleware
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

from chat.routing import websocket_urlpatterns
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
            SimpleJWTAuthTokenMiddleware(URLRouter(websocket_urlpatterns))
        ),
})

app = application