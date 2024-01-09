import { ProductListView } from 'src/sections/product/view';
// api
import { getProducts } from 'src/api/product';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Product List',
};

async function getData(pagination, order, filters, lang) {
  try {
    const res = await getProducts(pagination, order, filters, lang);

    const result = res.data;
    
    return { products: result.data, productsCount: result.total };
  } catch (error) {
    return { error };
  }
}

export default async function ProductListPage({ params, searchParams }) {
  const { lang } = params;

  const { page, limit, orderBy, direction } = searchParams;

  const pagination = { page: Number(page) || 1, limit: Number(limit) || 5 };

  const order = { orderBy, direction };

  const filters = [];

  const { products, productsCount, error } = await getData(pagination, order, filters, lang);

  if(error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <ProductListView products={products} productsCount={productsCount} />;
}
