'use server'

import axios from 'src/utils/axios';
import { REST_API } from 'src/config-global';

export async function getCampaigns(pagination, order, filters, lang) {
    try {
        let URL = `${REST_API}/campaigns?page=${pagination.page}&limit=${pagination.limit}&lang=${lang}`;

        if(filters.length > 0) {
            filters.forEach((filter) => {
                if (filter.value) {
                    URL += `&${filter.id}=${filter.value}`;
                }
            })
        }
    
        if(order?.orderBy && order?.direction) {
            URL += `&field=${order.orderBy}&direction=${order.direction}`;
        }

        const res = await axios.get(URL);
    
        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'object' ? error.message : error;
        return { error: message };
    }
}

export async function getAllCampaigns(lang) {
    const URL = `${REST_API}/campaigns/all?lang=${lang}`;

    try {
        const res = await axios.get(URL);

        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        return { error: message };
    }
}

export async function getUpcomingCampaigns(lang) {
    try {
        const URL = `${REST_API}/campaigns/upcoming?lang=${lang}`;

        const res = await axios.get(URL);
    
        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'object' ? error.message : error;
        return { error: message };
    }
}

export async function getCampaignById(id, lang) {
    const URL = `${REST_API}/campaigns/${id}?lang=${lang}`;

    const res = await axios.get(URL);

    return { status: res.status, data: res.data };
}

export async function createCampaign(data) {
    try {
        const URL = `${REST_API}/campaigns`;

        const res = await axios.post(URL, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return { status: res.status, data: res.data };
    } catch (error) {
        const message = error.message || 'Възникна грешка';
        throw message;
    }
}

export async function editCampaign(id, data) {
    try {
        const URL = `${REST_API}/campaigns/${id}?_method=PUT`;

        const res = await axios.post(URL, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        throw message;
    }
}

export async function deleteCampaign(id) {
    try {
        const URL = `${REST_API}/campaigns/${id}`;

        const res = await axios.delete(URL);

        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        throw message;
    }
}

export async function deleteCampaigns(ids) {
    try {
        const URL = `${REST_API}/campaigns/deleteMany`;

        const res = await axios.delete(URL, {
            data: { ids }
        });

        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        throw message;
    }
}

export async function participate(data) {
    try {
        const URL = `${REST_API}/campaigns/participate`;

        const res = await axios.post(URL, data);

        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        return { error: message };
    }
}

export async function unsubscribe(campaignId, userId) {
    try {
        const URL = `${REST_API}/campaigns/unsubscribe/${campaignId}/${userId}`;

        const res = await axios.delete(URL);

        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        return { error: message };
    }
}