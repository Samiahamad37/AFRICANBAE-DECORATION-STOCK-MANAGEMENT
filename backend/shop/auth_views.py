from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .auth_serializers import (
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    ChangePasswordSerializer,
    PasswordResetSerializer,
    PasswordResetConfirmSerializer
)
from django.contrib.auth.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from django.utils.http import (
    urlsafe_base64_encode,
    urlsafe_base64_decode
)

from django.utils.encoding import (
    smart_bytes,
    force_str
)

from django.core.mail import send_mail
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status




class PasswordResetView(APIView):
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    def post(self, request):

        serializer = PasswordResetSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']

        try:

            user = User.objects.get(email=email)

            uidb64 = urlsafe_base64_encode(
                smart_bytes(user.id)
            )

            token = PasswordResetTokenGenerator().make_token(user)

            # reset_link = (
            #     f"http://localhost:5173/"
            #     f"reset-password/{uidb64}/{token}"

            # AFTER
            frontend_url = settings.FRONTEND_URL  # ← read from environment variable
            reset_link = f"{frontend_url}/reset-password/{uidb64}/{token}"

            try:
                send_mail(
                    subject="Reset Your Password",
                    message=f"Reset link: {reset_link}",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False,
                )
            except Exception as e:
                import traceback
                print(traceback.format_exc())
                return Response(
                    {
                        "success": False,
                        "error": str(e)
                    },
                    status=500
                )

            return Response(
                {
                    "success": True,
                    "message": "Password reset email sent"
                },
                status=status.HTTP_200_OK
            )

        except User.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "User not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )


class PasswordResetConfirmView(APIView):
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):

        serializer = PasswordResetConfirmSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        try:

            user_id = force_str(
                urlsafe_base64_decode(uidb64)
            )

            user = User.objects.get(id=user_id)

            if not PasswordResetTokenGenerator().check_token(
                user,
                token
            ):

                return Response(
                    {
                        "success": False,
                        "message": "Invalid token"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            user.set_password(
                serializer.validated_data['new_password']
            )

            user.save()

            return Response(
                {
                    "success": True,
                    "message": "Password reset successful"
                },
                status=status.HTTP_200_OK
            )

        except Exception:

            return Response(
                {
                    "success": False,
                    "message": "Something went wrong"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class RegisterView(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


class ChangePasswordView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response(
                    {'old_password': 'Wrong password.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'message': 'Password changed successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout user - frontend should delete tokens"""
    return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get current user profile"""
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
    })
