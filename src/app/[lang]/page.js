import { HomeView } from 'src/sections/home/view';
// api
import { getUpcomingCampaigns } from 'src/api/campaign';
import { getLatestProducts } from 'src/api/product';
import { getLocations } from 'src/api/location';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Minimal: The starting point for your next project',
};

async function getData(lang) {
  try {
    const { data: campaigns, error: campaignsError } = await getUpcomingCampaigns(lang);

    if (campaignsError) throw campaignsError;

    const { data: products, error: productsError } = await getLatestProducts(lang);

    if (productsError) throw productsError;

    const { data: locations, error: locationsError } = await getLocations([]);

    if (locationsError) throw locationsError;

    return { campaigns, products, locations };
  } catch (error) {
    return { error };
  }
}

export default async function HomePage({ params }) {
  const { lang } = params;

  const { campaigns, products, locations, error } = await getData(lang);

  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <HomeView campaigns={campaigns} products={products} locations={locations} />;
}
