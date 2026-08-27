import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { PEOPLE_BY_ID } from '../../../core/data/family.data';
import { Heritage } from '../../../core/models/heritage.enum';
import { MediaKind } from '../../../core/models/media-kind.enum';
import { Person } from '../../../core/models/person.model';
import { AudioService } from '../../../core/services/audio.service';
import { computeAge, formatAge, formatDate } from '../../../core/utils/age.util';
import { FocusTrapDirective } from '../../../shared/directives/focus-trap.directive';
import { MediaViewerComponent } from '../media-viewer/media-viewer.component';

const AGE_TOKEN = /\{age:(\w+)}/g;

@Component({
  selector: 'app-person-dialog',
  imports: [MediaViewerComponent],
  templateUrl: './person-dialog.component.html',
  styleUrl: './person-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [FocusTrapDirective],
  host: {
    role: 'dialog',
    'aria-modal': 'true',
    '[style.--accent]': 'person().accent',
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class PersonDialogComponent {
  protected readonly MediaKind = MediaKind;
  protected readonly Heritage = Heritage;
  /** Devise de la famille, identique sur chaque fiche : rien d'attribué à la personne. */
  protected readonly motto = 'La famille, c\'est là où la vie commence et où l\'amour ne finit jamais.';

  readonly person = input.required<Person>();
  readonly dismissed = output<void>();

  private readonly audio = inject(AudioService);
  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');

  protected readonly viewerAt = signal<number | null>(null);
  protected readonly slide = signal(0);

  protected readonly firstName = computed(() => this.person().name.split(' ')[0]);
  protected readonly age = computed(() => formatAge(this.person().birth.date));
  protected readonly initial = computed(() => this.person().name.charAt(0));
  protected readonly current = computed(() => this.person().media[this.slide()]);

  protected readonly birthLine = computed(() => {
    const { feminine, birth } = this.person();
    const hour = birth.time ? ` à ${birth.time.replace(':', 'h')}` : '';
    return `${feminine ? 'Née' : 'Né'} le ${formatDate(birth.date)}${hour}`;
  });

  protected readonly deathLine = computed(() => {
    const { feminine, death } = this.person();
    if (!death) {
      return null;
    }
    const place = death.place ? ` à ${death.place}` : '';
    return `${feminine ? 'Décédée' : 'Décédé'} le ${formatDate(death.date)}${place}`;
  });

  /** Résout les jetons «{age:id}» hérités des anciens templates. */
  protected readonly bio = computed(() =>
    this.person().bio.map(paragraph =>
      paragraph.replace(AGE_TOKEN, (_, id: string) => String(computeAge(PEOPLE_BY_ID[id].birth.date))),
    ),
  );

  constructor() {
    document.body.classList.add('is-locked');
    const opener = document.activeElement as HTMLElement | null;

    afterNextRender(() => {
      const song = this.person().song;
      if (song) {
        this.audio.focusOn(song);
      }
      this.panel().nativeElement.focus();
    });

    inject(DestroyRef).onDestroy(() => {
      this.audio.release();
      document.body.classList.remove('is-locked');
      opener?.focus();
    });
  }

  protected step(delta: number): void {
    const count = this.person().media.length;
    this.slide.set((this.slide() + delta + count) % count);
  }

  /** Échap referme d'abord la visionneuse, la fiche seulement ensuite. */
  protected onEscape(): void {
    if (this.viewerAt() !== null) {
      this.viewerAt.set(null);
      return;
    }
    this.dismissed.emit();
  }
}
