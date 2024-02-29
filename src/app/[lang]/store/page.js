import { ProductShopView } from 'src/sections/product/view';
import { getProducts } from 'src/api/product';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Капачки за бъдеще: Магазин',
};

async function getData(lang, pagination, order, filters) {
    const { data: productsRes, error } = await getProducts(pagination, order, filters, lang);

    return { products: productsRes.data, productsCount: productsRes.total, error };
}

export default async function StorePage({ params, searchParams }) {
  const { lang } = params;

  const { page, search, sort } = searchParams;

  const pagination = { page, limit: 8 };

  const order = { orderBy: 'price', direction: sort };
  if (sort !== 'asc' && sort !== 'desc') {
    order.direction = 'asc';
  }

  const filters = [{ id: 'search', value: search }];

  const { products, productsCount, error } = await getData(lang, pagination, order, filters);

  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <ProductShopView products={products} productsCount={productsCount} />;
}
