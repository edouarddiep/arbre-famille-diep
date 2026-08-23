import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, effect, ElementRef, inject, input, output, signal, viewChild, viewChildren } from '@angular/core';
import { MediaKind } from '../../../core/models/media-kind.enum';
import { Media } from '../../../core/models/person.model';
import { FocusTrapDirective } from '../../../shared/directives/focus-trap.directive';

/** Délai d'immobilité au-delà duquel le rail est considéré comme posé. */
const SETTLE_MS = 140;

@Component({
  selector: 'app-media-viewer',
  templateUrl: './media-viewer.component.html',
  styleUrl: './media-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [FocusTrapDirective],
  host: {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': 'Visionneuse de photos',
    '(document:keydown.arrowLeft)': 'step(-1)',
    '(document:keydown.arrowRight)': 'step(1)',
    '(window:resize)': 'realign()',
  },
})
export class MediaViewerComponent {
  protected readonly MediaKind = MediaKind;

  readonly media = input.required<readonly Media[]>();
  readonly startAt = input(0);
  readonly closed = output<void>();

  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly closeButton = viewChild.required<ElementRef<HTMLButtonElement>>('closeButton');
  private readonly slides = viewChildren<ElementRef<HTMLElement>>('slide');
  private readonly clips = viewChildren<ElementRef<HTMLVideoElement>>('clip');

  private settleTimer?: ReturnType<typeof setTimeout>;

  protected readonly index = signal(0);
  protected readonly current = computed(() => this.media()[this.index()]);

  constructor() {
    afterNextRender(() => {
      this.index.set(this.startAt());
      this.scrollTo(this.startAt(), 'instant');
      this.closeButton().nativeElement.focus();
      // La largeur du rail peut encore bouger le temps que la mise en page se pose.
      this.settleTimer = setTimeout(() => this.realign(), SETTLE_MS * 3);
    });

    effect(() => this.playCurrentClip(this.index()));
    inject(DestroyRef).onDestroy(() => clearTimeout(this.settleTimer));
  }

  /** La vidéo arrivée à l'écran démarre d'elle-même, les autres se mettent en pause. */
  private playCurrentClip(active: number): void {
    const clips = this.clips().map(clip => clip.nativeElement);
    clips.filter(clip => this.slideOf(clip) !== active).forEach(clip => clip.pause());
    clips.find(clip => this.slideOf(clip) === active)?.play().catch(() => undefined);
  }

  private slideOf(clip: HTMLVideoElement): number {
    return Number(clip.dataset['slide']);
  }

  protected step(delta: number): void {
    this.scrollTo(this.index() + delta, 'smooth');
  }

  protected jump(target: number): void {
    this.scrollTo(target, 'smooth');
  }

  /** La position réelle du défilement fait foi : glisser au doigt met à jour l'index. */
  protected onScroll(): void {
    this.index.set(this.nearestSlide());
    clearTimeout(this.settleTimer);
    this.settleTimer = setTimeout(() => this.realign(), SETTLE_MS);
  }

  /**
   * Un geste interrompu, une image arrivée après coup ou une largeur qui change
   * laissent le rail arrêté entre deux vues — on voit alors un bord de la photo
   * voisine. Dès que le défilement se pose, la diapositive est recadrée.
   */
  protected realign(): void {
    const element = this.track().nativeElement;
    const target = this.offsetOf(this.index());
    if (Math.abs(element.scrollLeft - target) > 1) {
      element.scrollTo({ left: target, behavior: 'smooth' });
    }
  }

  private scrollTo(target: number, behavior: ScrollBehavior): void {
    const clamped = Math.min(Math.max(target, 0), this.media().length - 1);
    this.track().nativeElement.scrollTo({ left: this.offsetOf(clamped), behavior });
    this.index.set(clamped);
  }

  /** Position mesurée de la diapositive : aucune hypothèse sur une largeur uniforme. */
  private offsetOf(index: number): number {
    return this.slides()[index]?.nativeElement.offsetLeft ?? 0;
  }

  private nearestSlide(): number {
    const { scrollLeft } = this.track().nativeElement;
    const offsets = this.slides().map(slide => slide.nativeElement.offsetLeft);
    return offsets.reduce((best, offset, i) => (Math.abs(offset - scrollLeft) < Math.abs(offsets[best] - scrollLeft) ? i : best), 0);
  }
}
