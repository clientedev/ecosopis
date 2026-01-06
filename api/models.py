from django.db import models
from django.contrib.auth.models import User

class Produto(models.Model):
    nome = models.CharField(max_length=255)
    descricao = models.TextField()
    ingredientes = models.TextField()
    beneficios = models.TextField()
    tags = models.JSONField(default=list)
    preco = models.IntegerField()  # em centavos
    canais = models.JSONField()  # {'site': bool, 'ml': str, 'shopee': str}
    imagem_url = models.URLField()
    categoria = models.CharField(max_length=100)
    e_assinatura = models.BooleanField(default=False)

    def __str__(self):
        return self.nome

class Pedido(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    total = models.IntegerField()
    status = models.CharField(max_length=50, default='pendente')
    criado_em = models.DateTimeField(auto_now_add=True)

class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='itens', on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    quantidade = models.IntegerField()
    preco = models.IntegerField()
