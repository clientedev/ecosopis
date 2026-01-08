from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Produto, Pedido, ItemPedido, User
from .serializers import ProdutoSerializer, PedidoSerializer, UserSerializer
from django.contrib.auth import authenticate, login, logout
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AI_INTEGRATIONS_OPENAI_API_KEY"),
    base_url=os.getenv("AI_INTEGRATIONS_OPENAI_BASE_URL"),
)

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer

    def get_permissions(self):
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

@api_view(['POST'])
def registrar(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def entrar(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        login(request, user)
        return Response(UserSerializer(user).data)
    return Response({'error': 'Credenciais inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def sair(request):
    logout(request)
    return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
def chat_beleza(request):
    mensagem = request.data.get('message')
    try:
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "Você é um consultor de beleza prestativo da Ecosopis, uma marca de cosméticos naturais e veganos. Você dá conselhos sobre tipos de pele e recomenda produtos Ecosopis. Seja amigável, profissional e conciso. Responda sempre em Português do Brasil."},
                {"role": "user", "content": mensagem}
            ],
            model="gpt-4o",
        )
        return Response({'response': completion.choices[0].message.content})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
