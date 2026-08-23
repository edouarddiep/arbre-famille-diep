import { Directive, ElementRef, inject } from '@angular/core';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';

/**
 * Retient le focus clavier à l'intérieur d'une couche modale. Le plus interne
 * l'emporte : la propagation est stoppée pour que la visionneuse prime sur la
 * fiche qui la contient.
 */
@Directive({
  selector: '[appFocusTrap]',
  host: {
    '(keydown.Tab)': 'wrap($event, false)',
    '(keydown.shift.Tab)': 'wrap($event, true)',
  },
})
export class FocusTrapDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected wrap(event: Event, backwards: boolean): void {
    event.stopPropagation();

    const items = [...this.host.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      element => element.offsetWidth > 0 || element.offsetHeight > 0,
    );
    if (!items.length) {
      return;
    }

    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;

    if (!backwards && active === last) {
      event.preventDefault();
      first.focus();
      return;
    }
    if (backwards && (active === first || !this.host.contains(active))) {
      event.preventDefault();
      last.focus();
    }
  }
}
