'use client'

import PropTypes from 'prop-types';

import MapHomeHero from '../map-home-hero';
import MapHomeContent from '../map-home-content';


export default function MapHomeView({ locations }) {
  return (
    <>
      <MapHomeHero />

      <MapHomeContent locations={locations} />
    </>
  );
}

MapHomeView.propTypes = {
  locations: PropTypes.array
}
