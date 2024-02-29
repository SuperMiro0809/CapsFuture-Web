import { ProductShopDetailsView } from 'src/sections/product/view';
import { getProductDetails } from 'src/api/product';

// ----------------------------------------------------------------------

async function getData(lang, slug) {
  const { data, error } = await getProductDetails(lang, slug);

  return { product: data, error };
}

export async function generateMetadata({ params }, parent) {
  // read route params
  const { lang, slug } = params;

  // fetch data
  const { product } = await getData(lang, slug);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: product?.title,
    openGraph: {
      images: [...previousImages],
    },
  }
}



export default async function StoreDetailsPage({ params }) {
  const { lang, slug } = params;

  const { product, error } = await getData(lang, slug);

  return <ProductShopDetailsView product={product} error={error} />;
}
