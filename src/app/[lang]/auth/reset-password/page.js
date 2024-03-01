import { ResetPasswordView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Капачки за бъдеще: Възстановяване на парола',
};

export default function ForgotPasswordPage({ searchParams }) {
  const { token, email } = searchParams;

  return <ResetPasswordView token={token} email={email} />;
}
