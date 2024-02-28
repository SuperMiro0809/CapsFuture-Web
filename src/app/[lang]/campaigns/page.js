import { CampaignListHomeView } from 'src/sections/campaign/view';
import { getCampaigns } from 'src/api/campaign';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Campaigns',
};

async function getData(lang, pagination, filters) {
    const { data: campaignsRes, error } = await getCampaigns(pagination, {}, filters, lang);

    return { campaigns: campaignsRes.data, campaignsCount: campaignsRes.total, error };
}

export default async function CampaignsPage({ params, searchParams }) {
  const { lang } = params;

  const { page, search, city, active } = searchParams;

  const pagination = { page, limit: 8 };

  const filters = [{ id: 'search', value: search }, { id: 'city', value: city }, { id: 'active', value: active }];

  const { campaigns, campaignsCount, error } = await getData(lang, pagination, filters);

  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <CampaignListHomeView campaigns={campaigns} campaignsCount={campaignsCount} />;
}
