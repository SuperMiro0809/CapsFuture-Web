import { HomeView } from 'src/sections/home/view';
// api
import { getUpcomingCampaigns } from 'src/api/campaign';
import { getAllProducts } from 'src/api/product';
import { getLocations } from 'src/api/location';
import { getAllFaqs } from 'src/api/faq';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Капачки за бъдеще',
};

async function getData(lang) {
  try {
    const { data: campaigns, error: campaignsError } = await getUpcomingCampaigns(lang);

    if (campaignsError) throw campaignsError;

    const { data: products, error: productsError } = await getAllProducts(lang, [{ id: 'show_on_home_page', value: true }]);

    if (productsError) throw productsError;

    const { data: locations, error: locationsError } = await getLocations([]);

    if (locationsError) throw locationsError;

    const { data: faqs, error: faqsError } = await getAllFaqs(lang);

    if (faqsError) throw faqsError;

    return { campaigns, products, locations, faqs };
  } catch (error) {
    return { error };
  }
}

export default async function HomePage({ params }) {
  const { lang } = params;

  const { campaigns, products, locations, faqs, error } = await getData(lang);

  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <HomeView campaigns={campaigns} products={products} locations={locations} faqs={faqs} />;
}
