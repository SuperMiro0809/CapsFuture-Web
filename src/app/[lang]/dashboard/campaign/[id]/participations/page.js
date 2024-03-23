import { CampaignParticipationsListView } from 'src/sections/campaign/view';
// api
import { getCampaignAttendances } from 'src/api/campaign-attendances';
import { getCampaignById } from 'src/api/campaign';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Campaign Participations',
};

async function getData(id, lang) {
  try {
    const { data: participations, error: participationsError } = await getCampaignAttendances(lang, id, []);
    
    if (participationsError) throw participationsError;

    const { data: campaign, error: campaignError } = await getCampaignById(id, lang);

    if (campaignError) throw campaignError;

    return { participations, campaign };
  } catch (error) {
    return { error };
  }
}

export default async function CampaignEditPage({ params }) {
  const { id, lang } = params;

  const { participations, campaign, error } = await getData(id, lang);

  if(error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <CampaignParticipationsListView participations={participations} campaign={campaign} />;
}
