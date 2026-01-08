from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProdutoViewSet, PedidoViewSet, registrar, entrar, sair, chat_beleza, me

router = DefaultRouter()
router.register(r'produtos', ProdutoViewSet)
router.register(r'pedidos', PedidoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/registrar/', registrar),
    path('auth/entrar/', entrar),
    path('auth/sair/', sair),
    path('auth/me/', me),
    path('chat/', chat_beleza),
]
