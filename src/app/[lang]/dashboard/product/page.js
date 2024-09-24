import { ProductListView } from 'src/sections/product/view';
// api
import { getAllProducts } from 'src/api/product';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Product List',
};

async function getData(lang) {
  try {
    const { data: products, error: productsError } = await getAllProducts(lang);

    if (productsError) throw productsError;
    
    return { products };
  } catch (error) {
    return { error };
  }
}

export default async function ProductListPage({ params }) {
  const { lang } = params;

  const { products, error } = await getData(lang);

  if(error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <ProductListView products={products} />;
}
