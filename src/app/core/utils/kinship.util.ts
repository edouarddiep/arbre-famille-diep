import { PEOPLE_BY_ID, SPOUSE_BY_ID } from '../data/family.data';
import { Person } from '../models/person.model';

/** Lien qui rattache une personne à la famille, dit de façon absolue. */
export interface Kinship {
  /** « Fils », « Fille », « Époux » ou « Épouse ». */
  readonly kin: string;
  readonly names: readonly string[];
  /** Identifiants des personnes citées, vers lesquelles l'arbre sait revenir. */
  readonly ids: readonly string[];
}

const firstName = (person: Person): string => person.name.split(' ')[0];

/**
 * Chacun entre dans la famille par naissance ou par alliance : c'est vrai quel
 * que soit le lecteur, là où « Papa » ou « Nièce » supposaient de savoir qui
 * regarde. Les fondateurs sans conjoint déclaré n'ont aucun lien à afficher.
 */
export const kinshipOf = (person: Person): Kinship | null => {
  const parents = person.parents ?? [];
  if (parents.length) {
    return {
      kin: person.feminine ? 'Fille' : 'Fils',
      names: parents.map(id => firstName(PEOPLE_BY_ID[id])),
      ids: parents,
    };
  }

  const spouse = SPOUSE_BY_ID[person.id];
  if (spouse) {
    return { kin: person.feminine ? 'Épouse' : 'Époux', names: [firstName(spouse)], ids: [spouse.id] };
  }
  return null;
};

/** « Fils d'An & Ly » : le « de » s'élide devant une voyelle. */
export const kinshipLabel = (kinship: Kinship): string => {
  const names = kinship.names.join(' & ');
  return `${kinship.kin} ${elides(names) ? "d'" : 'de '}${names}`;
};

export const elides = (name: string): boolean => /^[aeiouâàéèêîïôöùûüh]/i.test(name);
