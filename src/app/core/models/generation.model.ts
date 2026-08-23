import { BondType } from './bond-type.enum';
import { Person } from './person.model';

export interface Bond {
  readonly type: BondType;
  readonly label?: string;
  readonly members: readonly Person[];
}

export interface Generation {
  readonly id: string;
  readonly ordinal: string;
  readonly label: string;
  readonly caption: string;
  readonly bonds: readonly Bond[];
}
