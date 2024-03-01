import { OverviewAppView } from 'src/sections/overview/app/view';
import { getInfo } from 'src/api/dashboard';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: App',
};

async function getData() {
  const { data, error } = await getInfo();

  return { info: data, error }
}

export default async function OverviewAppPage() {
  const { info, error } = await getData();

  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <OverviewAppView info={info} />;
}
