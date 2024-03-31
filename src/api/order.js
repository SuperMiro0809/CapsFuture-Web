'use server'

import axios from 'src/utils/axios';
import { REST_API } from "src/config-global"

export async function createOrder(data) {
    const URL = `${REST_API}/orders`;

    try {
        const res = await axios.post(URL, data);

        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        return { error: message };
    }
}