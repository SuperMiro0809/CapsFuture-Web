'use server'

import { cookies } from 'next/headers';

export async function setTokenCookie(accessToken) {
    cookies().set({
        name: 'accessToken',
        value: accessToken,
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
    });
}

export async function deleteTokenCookie() {
    cookies().delete('accessToken');
}

export async function getTokenCookie() {
    return cookies().get('accessToken')?.value;
}