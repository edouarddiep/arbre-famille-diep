export const computeAge = (isoDate: string, from: Date = new Date()): number => {
  const birth = new Date(isoDate);
  const monthDelta = from.getMonth() - birth.getMonth();
  const age = from.getFullYear() - birth.getFullYear();
  if (monthDelta < 0 || (monthDelta === 0 && from.getDate() < birth.getDate())) {
    return age - 1;
  }
  return age;
};

const DAY_MS = 86_400_000;

/**
 * Âge tel qu'on le dit : en années dès la première, en mois avant, en jours pour
 * les tout premiers. Un nouveau-né afficherait sinon « 0 ans aujourd'hui ».
 */
export const formatAge = (isoDate: string, from: Date = new Date()): string => {
  const years = computeAge(isoDate, from);
  if (years >= 1) {
    return `${years} ans aujourd'hui`;
  }

  const days = Math.max(0, Math.floor((from.getTime() - new Date(isoDate).getTime()) / DAY_MS));
  if (days >= 61) {
    return `${Math.floor(days / 30.44)} mois`;
  }
  return days > 1 ? `${days} jours` : `${days} jour`;
};

export const formatDate = (isoDate: string): string =>
  new Intl.DateTimeFormat('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(isoDate));
