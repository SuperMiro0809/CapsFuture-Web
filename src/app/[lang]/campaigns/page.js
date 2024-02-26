import { CampaignListHomeView } from 'src/sections/campaign/view';
import { getCampaigns } from 'src/api/campaign';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Campaigns',
};

async function getData(lang, filters) {
    const { data: campaignsRes, error } = await getCampaigns({ page: 1, limit: 10 }, {}, filters, lang);

    return { campaigns: campaignsRes.data, campaignsCount: campaignsRes.total, error };
}

export default async function CampaignsPage({ params, searchParams }) {
  const { lang } = params;

  const { search, city, active } = searchParams;

  const filters = [{ id: 'search', value: search }, { id: 'city', value: city }, { id: 'active', value: active }];

  const { campaigns, campaignsCount, error } = await getData(lang, filters);

  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <CampaignListHomeView campaigns={campaigns} campaignsCount={campaignsCount} />;
}
