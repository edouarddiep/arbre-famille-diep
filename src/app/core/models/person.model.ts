import { Heritage } from './heritage.enum';
import { MediaKind } from './media-kind.enum';

export interface LifeEvent {
  readonly date: string;
  /** Absent tant que le lieu n'est pas connu : la ligne n'est alors pas affichée. */
  readonly place?: string;
  readonly time?: string;
}

export interface Media {
  readonly kind: MediaKind;
  readonly src: string;
  /** Variante allégée servie aux vignettes de galerie. */
  readonly preview?: string;
  readonly poster?: string;
  readonly alt: string;
}

export interface Song {
  readonly src: string;
  readonly startAt?: number;
  readonly volume?: number;
}

export interface Person {
  readonly id: string;
  readonly name: string;
  readonly voice: string;
  readonly feminine: boolean;
  /** Origine évoquée sur sa fiche ; absente sous la génération du tronc. */
  readonly heritage?: Heritage;
  /** Identifiants des parents dans la génération précédente. */
  readonly parents?: readonly string[];
  readonly accent: string;
  /** Sans portrait, la fiche et le médaillon affichent le monogramme du prénom. */
  readonly avatar?: string;
  readonly thumbnail?: string;
  readonly birth: LifeEvent;
  readonly death?: LifeEvent;
  readonly bio: readonly string[];
  readonly media: readonly Media[];
  /** Sans thème, la fiche laisse la musique d'ambiance se poursuivre. */
  readonly song?: Song;
}
