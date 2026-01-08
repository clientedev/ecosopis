from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    PERFIL_CHOICES = (
        ('admin', 'Administrador'),
        ('cliente', 'Cliente'),
    )
    perfil = models.CharField(max_length=10, choices=PERFIL_CHOICES, default='cliente')
    telefone = models.CharField(max_length=20, blank=True, null=True)

class Produto(models.Model):
    nome = models.CharField(max_length=255)
    descricao = models.TextField()
    ingredientes = models.TextField(blank=True, null=True)
    beneficios = models.TextField(blank=True, null=True)
    tags = models.JSONField(default=list, blank=True)
    preco = models.IntegerField()  # em centavos
    canais = models.JSONField(default=dict)  # {'site': bool, 'ml': str, 'shopee': str}
    imagem_url = models.URLField(max_length=500)
    categoria = models.CharField(max_length=100)
    e_assinatura = models.BooleanField(default=False)
    ativo = models.BooleanField(default=True)

    def __str__(self):
        return self.nome

class Pedido(models.Model):
    STATUS_CHOICES = (
        ('pendente', 'Pendente'),
        ('pago', 'Pago'),
        ('enviado', 'Enviado'),
        ('cancelado', 'Cancelado'),
    )
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pedidos')
    total = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')
    cep = models.CharField(max_length=10, default='')
    endereco = models.TextField(default='')
    criado_em = models.DateTimeField(auto_now_add=True)

class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='itens', on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.SET_NULL, null=True)
    quantidade = models.IntegerField()
    preco_unitario = models.IntegerField(default=0)
