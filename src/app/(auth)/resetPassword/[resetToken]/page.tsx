import ResetPasswordView from "./ResetPasswordView";

interface ResetPasswordPageProps {
  params: {
    resetToken: string;
  };
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { resetToken } = await params;

  return <ResetPasswordView resetToken={resetToken} />;
}
