'use server'

import { sendEmail } from 'src/utils/send-email';

export async function contactUsMail(data) {
  const { email, subject, message } = data;

  sendEmail(email, 'zevs8@abv.bg', subject, message);
}