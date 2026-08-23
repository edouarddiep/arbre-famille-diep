import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Heritage } from '../../../core/models/heritage.enum';
import { Person } from '../../../core/models/person.model';

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
  readonly filiation = input('');
  readonly highlighted = input(false);

  readonly selected = output<Person>();
  readonly ascend = output<void>();

  protected readonly birthYear = computed(() => this.person().birth.date.slice(0, 4));
}
