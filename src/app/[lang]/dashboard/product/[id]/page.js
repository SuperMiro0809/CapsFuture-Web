import PropTypes from 'prop-types';

import axios, { endpoints } from 'src/utils/axios';

import { getProductById } from 'src/api/product';

import { ProductDetailsView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Product Details',
};

export default async function ProductDetailsPage({ params }) {
  const { id } = params;

  const { data: product, error: productError } = await getProductById(id);

  return <ProductDetailsView product={product} productError={productError} />;
}

// export async function generateStaticParams() {
//   const res = await axios.get(endpoints.product.list);

//   return res.data.products.map((product) => ({
//     id: product.id,
//   }));
// }

ProductDetailsPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
