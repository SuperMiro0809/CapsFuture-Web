import { CampaignParticipateView } from 'src/sections/campaign/view';
// import { getCampaignById } from 'src/api/campaign';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Campaigns',
};

// async function getData(lang, id) {
//     const { data: campaign, error } = await getCampaignById(id, lang)

//     return { campaign, error };
// }

export default function CampaignsParticipatePage({ params }) {
  const { lang, slug } = params;

  // const { campaign, error } = await getData(lang, slug);

  return <CampaignParticipateView slug={slug} />
}
