from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from django.db import transaction
from .models import Product, Sale
from .serializers import (
    ProductSerializer, SaleSerializer,
    SellSerializer, RestockSerializer,
)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
 

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @transaction.atomic
    @action(detail=True, methods=['post'], url_path='sell',
            parser_classes=[JSONParser, MultiPartParser, FormParser])
    def sell(self, request, pk=None):
        product = self.get_object()
        serializer = SellSerializer(
            data=request.data,
            context={'product': product},
        )
        serializer.is_valid(raise_exception=True)

        qty = serializer.validated_data['quantity']
        product.stock -= qty
        product.save()

        sale = Sale.objects.create(
            product=product,
            product_name=product.name,
            product_category=product.category,
            unit_price=product.price,
            quantity=qty,
            total=product.price * qty,
        )

        return Response(
            {
                'sale': SaleSerializer(sale).data,
                'product': ProductSerializer(product, context={'request': request}).data,
            },
            status=status.HTTP_201_CREATED,
        )

    @transaction.atomic
    @action(detail=True, methods=['post'], url_path='restock',
            parser_classes=[JSONParser, MultiPartParser, FormParser])
    def restock(self, request, pk=None):
        product = self.get_object()
        serializer = RestockSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        qty = serializer.validated_data['quantity']
        product.stock += qty
        product.save()

        return Response(
            ProductSerializer(product, context={'request': request}).data,
            status=status.HTTP_200_OK,
        )


class SaleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Sale.objects.select_related('product').all()
    serializer_class = SaleSerializer
