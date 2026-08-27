/**
 * Mise en page posée : l'arbre vit dans un repère fixe de 1000 unités de large.
 * Toutes les positions étant exprimées en pourcentage de ce repère, chaque
 * personne occupe la même place à toutes les largeurs d'écran.
 */
export const STAGE_WIDTH = 1000;
export const STAGE_HEIGHT = 2240;

/** Proportions de l'aquarelle « arc » (branche d'olivier symétrique). */
export const ARC_RATIO = 724 / 2172;
/** Part de la hauteur de l'arc située au-dessus de sa ligne de branches. */
export const ARC_LIFT = 0.68;

/** Pied de l'olivier aquarellé, d'où part le premier lien. */
export const TREE_FOOT = 470;

/** Proportions de l'aquarelle « tronc inter-génération ». */
export const LINK_RATIO = 1024 / 1536;

export interface Slot {
  readonly id: string;
  readonly x: number;
  readonly y: number;
}

export interface Band {
  readonly generationId: string;
  /** Demi-portée de l'arc aquarellé, en unités de repère. */
  readonly reach: number;
  /** Largeur d'un médaillon et de son ruban : elle se resserre quand la génération s'élargit. */
  readonly nodeWidth: number;
  readonly labelY: number;
  readonly slots: readonly Slot[];
}

export const BANDS: readonly Band[] = [
  {
    generationId: 'roots',
    reach: 358,
    nodeWidth: 180,
    labelY: 560,
    slots: [
      { id: 'an', x: 176, y: 706 },
      { id: 'ly', x: 388, y: 706 },
      { id: 'achille', x: 612, y: 706 },
      { id: 'aikaterini', x: 824, y: 706 },
    ],
  },
  {
    generationId: 'trunk',
    reach: 232,
    nodeWidth: 180,
    labelY: 1006,
    slots: [
      { id: 'binh', x: 396, y: 1152 },
      { id: 'tina', x: 604, y: 1152 },
    ],
  },
  {
    generationId: 'branches',
    // Six médaillons : la branche s'ouvre davantage et chacun se resserre.
    reach: 470,
    nodeWidth: 140,
    labelY: 1452,
    slots: [
      { id: 'laura', x: 84, y: 1598 },
      { id: 'stephane', x: 250, y: 1598 },
      { id: 'eric', x: 417, y: 1598 },
      { id: 'edouard', x: 583, y: 1598 },
      { id: 'lydie', x: 750, y: 1598 },
      { id: 'kim', x: 916, y: 1598 },
    ],
  },
  {
    generationId: 'buds',
    reach: 460,
    nodeWidth: 165,
    labelY: 1898,
    slots: [
      { id: 'linh', x: 100, y: 2044 },
      { id: 'nam', x: 300, y: 2044 },
      { id: 'loan', x: 500, y: 2044 },
      { id: 'tao', x: 700, y: 2044 },
      { id: 'luana', x: 900, y: 2044 },
    ],
  },
];
