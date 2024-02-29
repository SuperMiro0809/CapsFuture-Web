'use client'

import PropTypes from 'prop-types';

import StoreHomeHero from '../product-shop-home-hero';

import StoreHomeContent from '../product-shop-home-content';

export default function ProductShopView({ products, productsCount }) {

  return (
    <>
      <StoreHomeHero />

      <StoreHomeContent products={products} productsCount={productsCount} />
    </>
  );
}

ProductShopView.propTypes = {
  products: PropTypes.array,
  productsCount: PropTypes.number
}
