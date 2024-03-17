'use server'

import axios from 'src/utils/axios';
import { ECONT_API } from 'src/config-global';

export async function getCountries() {
  try {
    const URL = `${ECONT_API}/Nomenclatures/NomenclaturesService.getCountries.json`;

    const { status, data } = await axios.get(URL, {
      auth: {
        username: "iasp-dev",
        password: "1Asp-dev"
      }
    });

    return { status, data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    return { error: message };
  }
}

export async function getCities(countryCode) {
  try {
    const URL = `${ECONT_API}/Nomenclatures/NomenclaturesService.getCities.json`;

    const body = { countryCode };

    const { status, data } = await axios.post(URL, body, {
      auth: {
        username: "iasp-dev",
        password: "1Asp-dev"
      }
    });

    return { status, data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    return { error: message };
  }
}

export async function getQuarters(cityID) {
  try {
    const URL = `${ECONT_API}/Nomenclatures/NomenclaturesService.getQuarters.json`;

    const body = { cityID };

    const { status, data } = await axios.post(URL, body, {
      auth: {
        username: "iasp-dev",
        password: "1Asp-dev"
      }
    });

    return { status, data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    return { error: message };
  }
}

export async function getStreets(cityID) {
  try {
    const URL = `${ECONT_API}/Nomenclatures/NomenclaturesService.getStreets.json`;

    const body = { cityID };

    const { status, data } = await axios.post(URL, body, {
      auth: {
        username: "iasp-dev",
        password: "1Asp-dev"
      }
    });

    return { status, data };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    return { error: message };
  }
}