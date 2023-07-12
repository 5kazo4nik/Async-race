export abstract class RouteCreator {
  public abstract url: string;

  private parent!: HTMLElement;
  protected container!: HTMLElement;
  protected isShown = false;

  public render(parent: HTMLElement): void {
    this.parent = parent;
    this.container = document.createElement('main');
  }

  public show(): void {
    if (!this.isShown) {
      this.isShown = true;
      this.parent.append(this.container);
    }
  }

  public hide(): void {
    if (this.isShown) {
      this.isShown = false;
      this.container.remove();
    }
  }
}
