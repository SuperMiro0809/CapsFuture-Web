import { ProductEditView } from 'src/sections/product/view';
// api
import { getProductById } from 'src/api/product';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Product Edit',
};

async function getData(id, lang) {
  try {
    const res = await getProductById(id);

    return { product: res.data };
  } catch (error) {
    return { error };
  }
}

export default async function ProductEditPage({ params }) {
  const { id, lang } = params;

  const { product, error } = await getData(id, lang);

  if(error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <ProductEditView product={product} />;
}
