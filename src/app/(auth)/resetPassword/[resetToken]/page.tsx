

import ResetPasswordView from "./ResetPasswordView";

export default async function Page({
  params,
}: {
  params: Promise<{ resetToken: string }>
}) {
  const { resetToken } = await params
   return <ResetPasswordView resetToken={resetToken} />
}


