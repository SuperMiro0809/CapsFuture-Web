'use server'

import axios from 'src/utils/axios';
import { REST_API } from 'src/config-global';

export async function getCampaignAttendances(lang, id, filters) {
    try {
        let URL = `${REST_API}/campaigns/${id}/attendances?lang=${lang}`;

        if(filters.length > 0) {
            filters.forEach((filter) => {
                if (filter.value) {
                    URL += `&${filter.id}=${filter.value}`;
                }
            })
        }

        const res = await axios.get(URL);

        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        return { error: message };
    }
}

export async function getUserAttendances(lang, id) {
    try {
        let URL = `${REST_API}/users/${id}/attendances?lang=${lang}`;

        const res = await axios.get(URL);

        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        return { error: message };
    }
}