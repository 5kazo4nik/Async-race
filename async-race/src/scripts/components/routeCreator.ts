import { Creator } from './creator';

export abstract class RouteCreator extends Creator {
  public abstract url: string;

  private parent!: HTMLElement;
  protected container!: HTMLElement;
  protected isShown = false;

  public render(parent: HTMLElement): void {
    this.parent = parent;
    this.container = document.createElement('div');
    this.container.classList.add('window-wrapper', 'inactive');
    this.parent.append(this.container);
  }

  public show(): void {
    if (!this.isShown) {
      this.isShown = true;
      this.container.classList.remove('inactive');
    }
  }

  public hide(): void {
    if (this.isShown) {
      this.isShown = false;
      this.container.classList.add('inactive');
    }
  }
}
