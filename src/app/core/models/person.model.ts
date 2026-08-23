import { Heritage } from './heritage.enum';
import { MediaKind } from './media-kind.enum';

export interface LifeEvent {
  readonly date: string;
  readonly place: string;
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
  /** Lien de parenté affiché sous le médaillon. */
  readonly role: string;
  readonly feminine: boolean;
  /** Origine évoquée sur sa fiche ; absente sous la génération du tronc. */
  readonly heritage?: Heritage;
  /** Identifiants des parents dans la génération précédente. */
  readonly parents?: readonly string[];
  readonly accent: string;
  readonly avatar: string;
  readonly thumbnail: string;
  readonly birth: LifeEvent;
  readonly death?: LifeEvent;
  readonly bio: readonly string[];
  readonly media: readonly Media[];
  readonly song: Song;
}
