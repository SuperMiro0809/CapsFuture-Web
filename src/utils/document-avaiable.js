// ----------------------------------------------------------------------

export function documentAvailable() {
  return typeof document !== 'undefined';
}

export function documentGetCookie(name) {
  const isDocumentAvailable = documentAvailable();

  let value;

  if (isDocumentAvailable) {
    const cookies = document.cookie.split('; ');

    const cookieString = cookies.find((cookie) => cookie.split('=')[0] === name);

    if (cookieString) {
      value = cookieString.split('=')[1];
    }
  }

  return value;
}
