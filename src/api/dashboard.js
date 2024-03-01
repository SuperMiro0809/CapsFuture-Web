'use server'

import axios from 'src/utils/axios';
import { REST_API } from 'src/config-global';

export async function getInfo() {
    try {
        const URL = `${REST_API}/dashboard`;

        const res = await axios.get(URL);
        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        return { error: message };
    }
}