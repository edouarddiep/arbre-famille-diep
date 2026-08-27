import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Heritage } from '../../../core/models/heritage.enum';
import { Person } from '../../../core/models/person.model';
import { elides, Kinship, kinshipLabel } from '../../../core/utils/kinship.util';

@Component({
  selector: 'app-person-card',
  templateUrl: './person-card.component.html',
  styleUrl: './person-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--accent]': 'person().accent',
    '[class.is-highlighted]': 'highlighted()',
  },
})
export class PersonCardComponent {
  protected readonly Heritage = Heritage;

  readonly person = input.required<Person>();
  readonly kinship = input<Kinship | null>(null);
  readonly highlighted = input(false);

  readonly selected = output<Person>();
  readonly ascend = output<void>();

  /**
   * Groupes insécables : « Vinh-Binh » ne doit pas se couper à son trait d'union
   * quand le ruban se replie, et l'article reste collé au prénom qu'il introduit.
   */
  protected readonly parts = computed(() => {
    const bond = this.kinship();
    if (!bond) {
      return [];
    }
    const [first, ...rest] = bond.names;
    return [bond.kin, `${elides(first) ? "d'" : 'de '}${first}`, ...rest.map(name => `& ${name}`)];
  });

  protected readonly label = computed(() => {
    const bond = this.kinship();
    return bond ? kinshipLabel(bond) : '';
  });

  protected readonly birthYear = computed(() => this.person().birth.date.slice(0, 4));
  protected readonly initial = computed(() => this.person().name.charAt(0));
}
