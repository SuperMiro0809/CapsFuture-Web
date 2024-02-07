import pick from 'lodash/pick';
import { LoginView } from 'src/sections/auth';
import { useTranslations, useMessages } from 'next-intl';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Login',
};

export default function LoginPage() {
  // const t = useTranslations();
  // console.log(t('locations'));

  // const messages = useMessages();

  // console.log(pick(messages, 'LoginPage'))

  return <LoginView />;
}
