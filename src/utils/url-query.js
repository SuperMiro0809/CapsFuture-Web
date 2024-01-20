import { isValid, format } from 'date-fns';

// ----------------------------------------------------------------------

export function encodeArray(array) {
  const serializedArray = JSON.stringify(array);

  const encodedArray = encodeURIComponent(serializedArray);

  return encodedArray;
}

export function decodeArray(array) {
  const decodedArray = decodeURIComponent(array);

  const parsedArray = JSON.parse(decodedArray);

  return parsedArray;
}

export function makeQuery(searchParams, pagination, order, filters) {
  const current = new URLSearchParams(Array.from(searchParams.entries()));

  current.set('page', pagination.page);

  current.set('limit', pagination.limit);

  if(order.orderBy && order.direction) {
    current.set('orderBy', order.orderBy);

    current.set('direction', order.direction);
  }

  if (filters.length) {
    filters.forEach(filter => {
      if (Array.isArray(filter.value)) {
        // handle array
      } else if (typeof filter.value === 'object' && isValid(filter.value)) {
        current.set(filter.id, format(filter.value, 'yyyy-MM-dd'))
      } else {
        current.set(filter.id, filter.value || '');
      }
    });
  }

  const search = current.toString();

  const query = search ? `?${search}` : '';

  return query;
}