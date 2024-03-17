'use server'

import { sendEmail } from 'src/utils/send-email';

export async function contactUsMail(data) {
  const { email, subject, message } = data;

  try {
    await sendEmail(email, 'zevs8@abv.bg', subject, message);

    return { status: 'Success' };
  } catch (error) {
    const message = typeof error === 'string' ? error : error.message;
    return { error: message };
  }
}