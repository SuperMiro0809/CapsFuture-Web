import { CampaignListView } from "src/sections/campaign/view";
// api
import { getCampaigns } from 'src/api/campaign';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Campaigns',
};

async function getData(pagination, order, filters) {
  try {
    const res = await getCampaigns(pagination, order, filters);

    const result = res.data;

    return { campaigns: result.data, campaignsCount: result.total };
  } catch (error) {
    return { error };
  }
}

export default async function CampaignPage({ searchParams }) {
  const { page, limit, orderBy, direction, title } = searchParams;

  const pagination = { page: Number(page) || 1, limit: Number(limit) || 5 };

  const order = { orderBy, direction };

  const filters = [{ id: 'title', value: title }];

  const { campaigns, campaignsCount, error } = await getData(pagination, order, filters);

  if(error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <CampaignListView campaigns={campaigns} campaignsCount={campaignsCount} />;
}
