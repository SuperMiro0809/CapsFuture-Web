import { CampaignEditView } from 'src/sections/campaign/view';
// api
import { getCampaignById } from 'src/api/campaign';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: New Campaign',
};

async function getData(id, lang) {
  try {
    const res = await getCampaignById(id, lang);

    return { campaign: res.data };
  } catch (error) {
    return { error }
  }
}

export default async function CampaignEditPage({ params }) {
  const { id, lang } = params;

  const { campaign, error } = await getData(id, lang);

  if(error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <CampaignEditView campaign={campaign} />;
}
