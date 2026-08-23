/** Feuille lancéolée, pointe vers le haut, ancrée sur sa base. */
export const OLIVE_LEAF = 'M0 0C3.1-4 3.4-11.4 0-15.6-3.4-11.4-3.1-4 0 0Z';

export type Point = readonly [number, number];

export interface Leaf {
  readonly transform: string;
  /** Deux tons : le revers argenté de l'olivier alterne avec le vert sombre. */
  readonly pale: boolean;
}

export interface Bough {
  /** Ligne médiane, utilisée comme masque de pousse. */
  readonly spine: string;
  /** Longueur de cette médiane, pour piloter le tiret du masque. */
  readonly length: number;
  /** Contour plein de la maîtresse branche, effilée vers l'enfant. */
  readonly limb: string;
  /** Brindilles portant le feuillage. */
  readonly twigs: string;
  readonly leaves: readonly Leaf[];
  readonly olives: readonly { readonly x: number; readonly y: number }[];
}

interface Options {
  readonly startWidth?: number;
  readonly endWidth?: number;
  readonly twigCount?: number;
  readonly twigLength?: number;
}

/**
 * Rameau d'olivier posé sur une cubique de Bézier. La maîtresse branche est un
 * contour plein qui s'affine vers l'enfant ; les brindilles en partent en
 * alternance, chacune portant des feuilles opposées comme sur un vrai olivier.
 * Tout est calculé à partir de la courbe : le feuillage ne peut jamais s'en
 * désolidariser, quelle que soit la mise en page.
 */
export function oliveBough(p0: Point, c1: Point, c2: Point, p3: Point, options: Options = {}): Bough {
  const { startWidth = 11, endWidth = 2.6, twigCount = 5, twigLength = 26 } = options;
  const xs = [p0[0], c1[0], c2[0], p3[0]] as const;
  const ys = [p0[1], c1[1], c2[1], p3[1]] as const;

  const twigs: string[] = [];
  const leaves: Leaf[] = [];
  const olives: { x: number; y: number }[] = [];

  for (let i = 0; i < twigCount; i++) {
    const t = 0.24 + (0.72 * i) / (twigCount - 1);
    const [x, y] = at(t, xs, ys);
    const heading = angleAt(t, xs, ys);
    const side = i % 2 ? 1 : -1;
    const spread = heading + side * (52 - i * 3);
    const length = twigLength * (1 - 0.12 * i);

    const tip = [x + cos(spread) * length, y + sin(spread) * length] as const;
    twigs.push(`M${x.toFixed(1)} ${y.toFixed(1)}L${tip[0].toFixed(1)} ${tip[1].toFixed(1)}`);

    // Feuilles opposées le long de la brindille, plus une au bout.
    for (let k = 1; k <= 3; k++) {
      const along = k / 3.4;
      const lx = x + cos(spread) * length * along;
      const ly = y + sin(spread) * length * along;
      for (const wing of [-1, 1] as const) {
        leaves.push({
          transform:
            `translate(${lx.toFixed(1)} ${ly.toFixed(1)}) ` +
            `rotate(${(spread + 90 + wing * 58).toFixed(1)}) scale(${(0.94 + k * 0.06).toFixed(2)})`,
          pale: (k + i + (wing > 0 ? 1 : 0)) % 2 === 0,
        });
      }
    }
    leaves.push({
      transform: `translate(${tip[0].toFixed(1)} ${tip[1].toFixed(1)}) rotate(${(spread + 90).toFixed(1)}) scale(1.1)`,
      pale: i % 2 === 0,
    });

    if (i % 2 === 1) {
      olives.push({ x: x + cos(spread) * length * 0.62, y: y + sin(spread) * length * 0.62 + 4 });
    }
  }

  return {
    spine: `M${p0[0]} ${p0[1]}C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p3[0]} ${p3[1]}`,
    length: arcLength(xs, ys),
    limb: outline(xs, ys, startWidth, endWidth),
    twigs: twigs.join(''),
    leaves,
    olives,
  };
}

/** Longueur approchée de la cubique, par échantillonnage. */
function arcLength(xs: Coefficients, ys: Coefficients): number {
  const steps = 32;
  let total = 0;
  let previous = at(0, xs, ys);
  for (let i = 1; i <= steps; i++) {
    const current = at(i / steps, xs, ys);
    total += Math.hypot(current[0] - previous[0], current[1] - previous[1]);
    previous = current;
  }
  return Math.ceil(total);
}

/** Contour effilé : la courbe est décalée de part et d'autre selon sa normale. */
function outline(xs: Coefficients, ys: Coefficients, startWidth: number, endWidth: number): string {
  const samples = 26;
  const front: string[] = [];
  const back: string[] = [];

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const [x, y] = at(t, xs, ys);
    const radians = (angleAt(t, xs, ys) * Math.PI) / 180;
    const half = (startWidth + (endWidth - startWidth) * t) / 2;
    const nx = -Math.sin(radians) * half;
    const ny = Math.cos(radians) * half;
    front.push(`${(x + nx).toFixed(1)} ${(y + ny).toFixed(1)}`);
    back.unshift(`${(x - nx).toFixed(1)} ${(y - ny).toFixed(1)}`);
  }

  return `M${front.join('L')}L${back.join('L')}Z`;
}

type Coefficients = readonly [number, number, number, number];

const cos = (degrees: number) => Math.cos((degrees * Math.PI) / 180);
const sin = (degrees: number) => Math.sin((degrees * Math.PI) / 180);

function at(t: number, xs: Coefficients, ys: Coefficients): Point {
  return [pointAt(t, xs), pointAt(t, ys)];
}

function angleAt(t: number, xs: Coefficients, ys: Coefficients): number {
  return (Math.atan2(slopeAt(t, ys), slopeAt(t, xs)) * 180) / Math.PI;
}

function pointAt(t: number, [a, b, c, d]: Coefficients): number {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
}

function slopeAt(t: number, [a, b, c, d]: Coefficients): number {
  const u = 1 - t;
  return 3 * u * u * (b - a) + 6 * u * t * (c - b) + 3 * t * t * (d - c);
}
