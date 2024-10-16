import { CampaignListView } from "src/sections/campaign/view";
// api
import { getAllCampaigns } from 'src/api/campaign';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Campaigns',
};

export default async function CampaignPage({ params }) {
  const { lang } = params;

  const { data: campaigns, error: campaignsError } = await getAllCampaigns(lang);

  if(campaignsError) {
    return <div>{JSON.stringify(campaignsError)}</div>
  }

  return <CampaignListView campaigns={campaigns} />;
}
