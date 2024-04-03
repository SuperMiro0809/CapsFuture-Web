'use server'

import axios from 'src/utils/axios';
import { DSK } from 'src/config-global';
import querystring from 'querystring';

export async function getBankTerminalLink(data) {
    const URL = `${DSK.api}/register.do`;

    const reqData = {
        ...data,
        userName: DSK.username,
        password: DSK.password
    }

    try {
        const res = await axios.post(URL, querystring.stringify(reqData), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        return { error: message };
    }
}

export async function getOrderStatus(orderNumber, lang='bg') {
    const URL = `${DSK.api}/getOrderStatusExtended.do`;

    const reqData = {
        orderNumber,
        userName: DSK.username,
        password: DSK.password,
        language: lang
    };

    try {
        const res = await axios.post(URL, querystring.stringify(reqData), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return { status: res.status, data: res.data };
    } catch (error) {
        const message = typeof error === 'string' ? error : error.message;
        return { error: message };
    }
}