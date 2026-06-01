from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import ProductViewSet, SaleViewSet
from .auth_views import (
    RegisterView,
    CustomTokenObtainPairView,
    ChangePasswordView,
    logout_view,
    user_profile,
    RequestPasswordResetView,
    PasswordResetConfirmView
)


router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'sales', SaleViewSet, basename='sale')
# router.register(r'auth/register', RegisterView, basename='register')
router.register(r'auth/change-password', ChangePasswordView, basename='change-password')

urlpatterns = [
    path('', include(router.urls)),
    path(
    'auth/register/',
    RegisterView.as_view({'post': 'register'}),
    name='register'
),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/profile/', user_profile, name='user_profile'),
    path(
        'password-reset/',
        RequestPasswordResetView.as_view(),
        name='password-reset'
    ),
    path(
        'password-reset-confirm/<uidb64>/<token>/',
        PasswordResetConfirmView.as_view(),
        name='password-reset-confirm'
    ),
]
