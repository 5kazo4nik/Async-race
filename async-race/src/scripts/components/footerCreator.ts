import { Creator } from './creator';

export class FooterCreator extends Creator {
  private footer!: HTMLElement;
  private btnPrev!: HTMLElement;
  private bntNext!: HTMLElement;

  public render(parent: HTMLElement): void {
    this.footer = Creator.renderElem(parent, 'footer');
    this.btnPrev = Creator.renderElem(this.footer, 'div', ['btn', 'btn_prev'], 'Prev');
    this.btnPrev = Creator.renderElem(this.footer, 'div', ['btn', 'btn_next'], 'Next');
  }

  public update(parent: HTMLElement): void {
    this.footer.remove();
    parent.append(this.footer);
  }
}
