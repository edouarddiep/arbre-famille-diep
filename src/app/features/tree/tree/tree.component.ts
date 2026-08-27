import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ARC_LIFT, ARC_RATIO, BANDS, LINK_RATIO, Slot, STAGE_HEIGHT, STAGE_WIDTH, TREE_FOOT } from '../../../core/data/layout.data';
import { FAMILY, PEOPLE_BY_ID } from '../../../core/data/family.data';
import { Kinship, kinshipOf } from '../../../core/utils/kinship.util';
import { BondType } from '../../../core/models/bond-type.enum';
import { Generation } from '../../../core/models/generation.model';
import { Person } from '../../../core/models/person.model';
import { AudioService } from '../../../core/services/audio.service';
import { PersonCardComponent } from '../person-card/person-card.component';
import { PersonDialogComponent } from '../person-dialog/person-dialog.component';

const HIGHLIGHT_MS = 2600;
const TRUNK_X = STAGE_WIDTH / 2;



/** Tronc torsadé reliant deux générations, dans le repère de l'arbre. */
interface Link {
  readonly top: number;
  readonly height: number;
  readonly width: number;
}

/** Sommet de l'arc aquarellé d'une génération. */
function arcTop(band: (typeof BANDS)[number]): number {
  return band.slots[0].y - band.reach * 2 * ARC_RATIO * ARC_LIFT;
}

function linkBetween(from: number, to: number): Link {
  // Le lien déborde sur les arcs voisins : c'est ce recouvrement qui donne
  // l'impression d'un seul arbre plutôt que de segments juxtaposés.
  const gap = to - from;
  const height = gap * 1.34;
  return { top: from - gap * 0.2, height, width: height * LINK_RATIO * 1.42 };
}

/** Alliance : anneaux posés entre les deux médaillons d'un couple. */
interface Union {
  readonly x: number;
  readonly y: number;
  readonly label: string;
}

interface Placed {
  readonly person: Person;
  readonly x: number;
  readonly y: number;
  /** Naissance ou alliance : le lien qui rattache la personne à la famille. */
  readonly kinship: Kinship | null;
}

interface Tier {
  readonly generation: Generation;
  readonly labelY: number;
  /** Fourche aquarellée : arcs à hauteur des visages, tige pointant vers le bas. */
  readonly forkTop: number;
  readonly forkWidth: number;
  /** Largeur d'un médaillon, en unités du conteneur qu'est la scène. */
  readonly nodeWidth: string;
  readonly people: readonly Placed[];
}

@Component({
  selector: 'app-tree',
  imports: [PersonCardComponent, PersonDialogComponent],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeComponent {
  protected readonly stageWidth = STAGE_WIDTH;
  protected readonly stageHeight = STAGE_HEIGHT;

  protected readonly audio = inject(AudioService);
  protected readonly focused = signal<Person | null>(null);
  protected readonly highlighted = signal<readonly string[]>([]);

  private highlightTimer?: ReturnType<typeof setTimeout>;
  private readonly destroyRef = inject(DestroyRef);

  /** Charpente de l'arbre, entièrement posée : aucune mesure du DOM. */
  protected readonly tiers: readonly Tier[] = BANDS.map(band => {
    const generation = FAMILY.find(item => item.id === band.generationId)!;
    const people = band.slots.map(slot => {
      const person = PEOPLE_BY_ID[slot.id];
      return { person, x: slot.x, y: slot.y, kinship: kinshipOf(person) };
    });
    const width = band.reach * 2;
    return {
      generation,
      labelY: band.labelY,
      forkTop: arcTop(band),
      forkWidth: (width / STAGE_WIDTH) * 100,
      nodeWidth: `${(band.nodeWidth / STAGE_WIDTH) * 100}cqw`,
      people,
    };
  });

  /** Couples de chaque génération, lus depuis les liens déclarés dans les données. */
  protected readonly unions: readonly Union[] = BANDS.flatMap(band => {
    const generation = FAMILY.find(item => item.id === band.generationId)!;
    const slotOf = (id: string): Slot | undefined => band.slots.find(slot => slot.id === id);
    return generation.bonds
      .filter(bond => bond.type === BondType.Union && bond.members.length === 2)
      .map(bond => ({
        label: bond.members.map(member => member.name.split(' ')[0]).join(' & '),
        slots: bond.members.map(member => slotOf(member.id)),
      }))
      .filter((bond): bond is { label: string; slots: Slot[] } => bond.slots.every(slot => slot !== undefined))
      .map(({ label, slots: [left, right] }) => ({
        x: (left.x + right.x) / 2,
        y: left.y,
        label: `${label}, mariés`,
      }));
  });

  /** Troncs torsadés reliant chaque génération à la suivante. */
  protected readonly links: readonly Link[] = [
    linkBetween(TREE_FOOT, arcTop(BANDS[0])),
    ...BANDS.slice(1).map((band, index) => linkBetween(BANDS[index].slots[0].y + 96, arcTop(band))),
  ];

  constructor() {
    this.destroyRef.onDestroy(() => clearTimeout(this.highlightTimer));
    afterNextRender(() => this.audio.startAmbient());
  }



  /** Rejoint les personnes citées sous le médaillon : les amène à l'écran et les signale. */
  protected goToKin(kin: readonly string[]): void {
    const cards = kin
      .map(id => document.getElementById(`personne-${id}`))
      .filter((card): card is HTMLElement => card !== null);
    if (!cards.length) {
      return;
    }

    const top = Math.min(...cards.map(card => card.getBoundingClientRect().top)) + window.scrollY;
    const height = Math.max(...cards.map(card => card.offsetHeight));
    window.scrollTo({ top: top + height / 2 - window.innerHeight / 2, behavior: 'smooth' });

    clearTimeout(this.highlightTimer);
    this.highlighted.set(kin);
    this.highlightTimer = setTimeout(() => this.highlighted.set([]), HIGHLIGHT_MS);
  }
}
