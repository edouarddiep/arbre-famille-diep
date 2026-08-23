import { DestroyRef, Directive, ElementRef, inject, Injectable, signal } from '@angular/core';

/** Observateur unique partagé par toutes les directives : un seul callback pour toute la page. */
@Injectable({ providedIn: 'root' })
export class RevealObserver {
  private readonly targets = new Map<Element, () => void>();
  private readonly observer =
    typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(
          entries =>
            entries
              .filter(entry => entry.isIntersecting)
              .forEach(entry => {
                this.targets.get(entry.target)?.();
                this.unobserve(entry.target);
              }),
          { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
        );

  observe(target: Element, onReveal: () => void): void {
    if (!this.observer) {
      onReveal();
      return;
    }
    this.targets.set(target, onReveal);
    this.observer.observe(target);
  }

  unobserve(target: Element): void {
    this.targets.delete(target);
    this.observer?.unobserve(target);
  }
}

@Directive({
  selector: '[appReveal]',
  host: { '[class.is-revealed]': 'revealed()' },
})
export class RevealDirective {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly observer = inject(RevealObserver);

  protected readonly revealed = signal(false);

  constructor() {
    this.observer.observe(this.element, () => this.revealed.set(true));
    inject(DestroyRef).onDestroy(() => this.observer.unobserve(this.element));
  }
}
