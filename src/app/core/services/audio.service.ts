import { Injectable, signal } from '@angular/core';
import { AMBIENT_SONG } from '../data/family.data';
import { Song } from '../models/person.model';

const FADE_STEP_MS = 40;
const FADE_DURATION_MS = 500;
const GESTURES = ['pointerdown', 'keydown', 'touchstart'] as const;

/**
 * Invariant : une seule piste a le droit de sonner à un instant donné.
 * Toute demande devient la cible unique ; une lecture qui aboutit alors que la
 * cible a changé se coupe d'elle-même. Le résultat ne dépend donc jamais de
 * l'ordre dans lequel les promesses de lecture se résolvent.
 */
@Injectable({ providedIn: 'root' })
export class AudioService {
  private readonly ambientMuted = signal(false);
  readonly isAmbientMuted = this.ambientMuted.asReadonly();

  private readonly tracks = new Map<string, HTMLAudioElement>();
  private readonly fades = new Map<HTMLAudioElement, ReturnType<typeof setInterval>>();

  private target?: HTMLAudioElement;
  private pendingGesture?: AbortController;

  /** Thème de la fiche ouverte, s'il y en a une. Seul état dont dépend la bascule. */
  private focusedSong?: Song;

  startAmbient(): void {
    this.request(this.ambient());
  }

  /** Ne concerne que la musique d'ambiance : les thèmes des fiches restent audibles. */
  toggleAmbient(): void {
    this.ambientMuted.update(muted => !muted);

    // Une fiche ouverte garde la main : son thème reprendra ou non à la fermeture.
    if (this.focusedSong) {
      return;
    }
    if (this.ambientMuted()) {
      this.silence();
    } else {
      this.request(this.ambient());
    }
  }

  focusOn(song: Song): void {
    this.focusedSong = song;
    this.request(this.track(song));
  }

  release(): void {
    this.focusedSong = undefined;
    if (this.ambientMuted()) {
      this.silence();
      return;
    }
    this.request(this.ambient());
  }

  private ambient(): HTMLAudioElement {
    return this.track(AMBIENT_SONG);
  }

  private track(song: Song): HTMLAudioElement {
    let audio = this.tracks.get(song.src);
    if (!audio) {
      audio = new Audio(song.src);
      audio.loop = true;
      audio.preload = 'none';
      audio.dataset['volume'] = String(song.volume ?? 0.4);
      audio.addEventListener('loadedmetadata', () => (audio!.currentTime = song.startAt ?? 0), { once: true });
      this.tracks.set(song.src, audio);
    }
    return audio;
  }

  private request(audio: HTMLAudioElement): void {
    if (audio === this.ambient() && this.ambientMuted()) {
      this.silence();
      return;
    }

    this.target = audio;
    this.disarmGesture();
    this.tracks.forEach(other => other !== audio && this.hush(other));

    this.cancelFade(audio);
    audio.volume = Number(audio.dataset['volume'] ?? 0.4);
    audio
      .play()
      .then(() => this.target !== audio && this.hush(audio))
      .catch((error: DOMException) => {
        if (this.target === audio && error?.name === 'NotAllowedError') {
          this.playOnFirstGesture(audio);
        }
      });
  }

  private silence(): void {
    this.target = undefined;
    this.disarmGesture();
    this.tracks.forEach(track => this.hush(track));
  }

  /** Les navigateurs refusent le son avant toute interaction : on rejoue au premier geste. */
  private playOnFirstGesture(audio: HTMLAudioElement): void {
    this.disarmGesture();
    this.pendingGesture = new AbortController();
    const options = { once: true, passive: true, signal: this.pendingGesture.signal };
    const play = () => this.target === audio && this.request(audio);
    GESTURES.forEach(gesture => document.addEventListener(gesture, play, options));
  }

  private disarmGesture(): void {
    this.pendingGesture?.abort();
    this.pendingGesture = undefined;
  }

  /**
   * Le fondu suit l'horloge, jamais le volume relu : iOS ignore les écritures de
   * volume, et une extinction conditionnée à sa décroissance n'y arriverait
   * jamais — la piste sonnerait indéfiniment sous celle qui prend la main. Là où
   * la baisse ne prend pas, la coupure est donc immédiate plutôt que fondue.
   */
  private hush(audio: HTMLAudioElement): void {
    this.cancelFade(audio);
    if (audio.paused) {
      audio.currentTime = 0;
      return;
    }

    const from = audio.volume;
    const startedAt = performance.now();
    const timer = setInterval(() => {
      const progress = (performance.now() - startedAt) / FADE_DURATION_MS;
      const target = Math.max(0, from * (1 - progress));
      audio.volume = target;
      if (progress < 1 && Math.abs(audio.volume - target) < 0.01) {
        return;
      }
      this.cancelFade(audio);
      audio.pause();
      audio.currentTime = 0;
    }, FADE_STEP_MS);
    this.fades.set(audio, timer);
  }

  private cancelFade(audio: HTMLAudioElement): void {
    const timer = this.fades.get(audio);
    if (timer !== undefined) {
      clearInterval(timer);
      this.fades.delete(audio);
    }
  }
}
