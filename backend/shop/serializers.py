from rest_framework import serializers
from .models import Product, Sale


class ProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'description',
            'price', 'stock', 'image', 'image_url',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_image_url(self, obj):
        if obj.image:
             url = str(obj.image.url)
        return url.replace('http://', 'https://')  # Ensure secure URL
        return None


class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = [
            'id', 'product', 'product_name', 'product_category',
            'unit_price', 'quantity', 'total', 'sold_at',
        ]
        read_only_fields = [
            'id', 'product_name', 'product_category',
            'unit_price', 'total', 'sold_at',
        ]


class SellSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)

    def validate_quantity(self, value):
        product = self.context.get('product')
        if product and value > product.stock:
            raise serializers.ValidationError(
                f"Only {product.stock} units in stock."
            )
        return value


class RestockSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)
