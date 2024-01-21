'use server'

import { GOOGLE_MAPS } from 'src/config-global';

export async function forwardGeocode(address, language = 'bg') {
  const url = `${GOOGLE_MAPS.url}?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS.key}&language=${language}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    } else {
      console.error('Geocoding failed:', data.status);
      return null;
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

export async function reverseGeocode(lat, lng, language = 'bg') {
  const url = `${GOOGLE_MAPS.url}?latlng=${lat},${lng}&key=${GOOGLE_MAPS.key}&language=${language}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const address = data.results[0].formatted_address;
      return address;
    } else {
      console.error('Reverse geocoding failed:', data.status);
      return null;
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}