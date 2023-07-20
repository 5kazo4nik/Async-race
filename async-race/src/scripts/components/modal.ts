import { WinResults } from '../types/dataTypes';
import { Creator } from './creator';

export class ModalResult extends Creator {
  private parent!: HTMLElement;
  private modal!: HTMLElement;
  private isShown = false;

  public render(parent: HTMLElement): void {
    this.parent = parent;
    this.modal = document.createElement('div');
    this.modal.classList.add('modal');
    this.subscriveEvents();
  }

  private subscriveEvents(): void {
    this.emitter.subscribe<WinResults>('winRace', ({ name, time }) => {
      this.show(name, time);
    });

    this.emitter.subscribe('resetRace', () => {
      this.hide();
    });
  }

  private show(name: string, time: number): void {
    if (!this.isShown) {
      this.isShown = true;
      this.modal.textContent = `${name} went first [${time}s]!`;
      this.parent.append(this.modal);
    }
  }

  private hide(): void {
    if (this.isShown) {
      this.isShown = false;
      this.modal.textContent = '';
      this.modal.remove();
    }
  }
}
