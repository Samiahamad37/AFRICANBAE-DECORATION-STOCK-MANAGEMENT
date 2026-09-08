import ResetPasswordConfirm from '@/components/ResetPasswordConfirm'

export default async function ResetPasswordPage({ params }) {
  const { uidb64, token } = await params
  return <ResetPasswordConfirm uidb64={uidb64} token={token} />
}
