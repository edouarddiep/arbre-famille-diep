export const computeAge = (isoDate: string, from: Date = new Date()): number => {
  const birth = new Date(isoDate);
  const monthDelta = from.getMonth() - birth.getMonth();
  const age = from.getFullYear() - birth.getFullYear();
  if (monthDelta < 0 || (monthDelta === 0 && from.getDate() < birth.getDate())) {
    return age - 1;
  }
  return age;
};

export const formatDate = (isoDate: string): string =>
  new Intl.DateTimeFormat('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(isoDate));
