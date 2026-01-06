from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProdutoViewSet, registrar, entrar, sair, chat_beleza

router = DefaultRouter()
router.register(r'produtos', ProdutoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/registrar/', registrar),
    path('auth/entrar/', entrar),
    path('auth/sair/', sair),
    path('chat/', chat_beleza),
]
