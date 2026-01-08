from rest_framework import serializers
from .models import Produto, Pedido, ItemPedido, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'perfil', 'telefone', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = '__all__'

class ItemPedidoSerializer(serializers.ModelSerializer):
    produto_nome = serializers.ReadOnlyField(source='produto.nome')
    class Meta:
        model = ItemPedido
        fields = ('id', 'produto', 'produto_nome', 'quantidade', 'preco_unitario')

class PedidoSerializer(serializers.ModelSerializer):
    itens = ItemPedidoSerializer(many=True, read_only=True)
    class Meta:
        model = Pedido
        fields = ('id', 'usuario', 'total', 'status', 'cep', 'endereco', 'criado_em', 'itens')
