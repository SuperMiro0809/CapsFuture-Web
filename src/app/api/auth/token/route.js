import { cookies } from 'next/headers';
// utils
import { endpoints } from 'src/utils/axios';

export async function GET(request) {
  // const authToken = cookies().get('accessToken')?.value;
  // const headers = new Headers();
  // headers.append('Authorization', authToken);

  // const response = await fetch(endpoints.auth.profile, {
  //     headers: headers
  // });

  const resData = {
    token: cookies().get('accessToken')?.value
  }

  return new Response(JSON.stringify(resData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}