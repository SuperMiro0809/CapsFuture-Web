import { getYear, isSameDay, isSameMonth } from 'date-fns';

import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function shortDateLabel(startDate, endDate, options = {}) {
  const getCurrentYear = new Date().getFullYear();

  const startDateYear = startDate ? getYear(startDate) : null;

  const endDateYear = endDate ? getYear(endDate) : null;

  const currentYear = getCurrentYear === startDateYear && getCurrentYear === endDateYear;

  const sameDay = startDate && endDate ? isSameDay(new Date(startDate), new Date(endDate)) : false;

  const sameMonth =
    startDate && endDate ? isSameMonth(new Date(startDate), new Date(endDate)) : false;

  if (currentYear) {
    if (sameMonth) {
      if (sameDay) {
        return fDate(endDate, 'dd MMM yy', options);
      }
      return `${fDate(startDate, 'dd', options)} - ${fDate(endDate, 'dd MMM yy', options)}`;
    }
    return `${fDate(startDate, 'dd MMM', options)} - ${fDate(endDate, 'dd MMM yy', options)}`;
  }

  return `${fDate(startDate, 'dd MMM yy', options)} - ${fDate(endDate, 'dd MMM yy', options)}`;
}
