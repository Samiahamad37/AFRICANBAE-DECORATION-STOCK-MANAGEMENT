import ResetPasswordConfirm from '@/components/ResetPasswordConfirm'

export default function ResetPasswordPage({ params }) {
  return <ResetPasswordConfirm uidb64={params.uidb64} token={params.token} />
}
