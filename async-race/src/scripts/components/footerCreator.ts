import { Creator } from './creator';

export class FooterCreator extends Creator {
  private footer!: HTMLElement;
  private btnPrev!: HTMLElement;
  private bntNext!: HTMLElement;

  private url = '';

  public render(parent: HTMLElement): void {
    this.footer = Creator.renderElem(parent, 'footer');
    this.btnPrev = Creator.renderElem(this.footer, 'div', ['btn', 'btn_prev'], 'Prev');
    this.bntNext = Creator.renderElem(this.footer, 'div', ['btn', 'btn_next'], 'Next');
    this.subscribeEvents();
    this.bindEvents();
  }

  private bindEvents(): void {
    this.bntNext.addEventListener('click', () => {
      if (!this.bntNext.classList.contains('inactive')) {
        this.emitter.emit('nextPage', this.url);
      }
    });
    this.btnPrev.addEventListener('click', () => {
      if (!this.btnPrev.classList.contains('inactive')) {
        this.emitter.emit('prevPage', this.url);
      }
    });
  }

  private subscribeEvents(): void {
    this.emitter.subscribe('lastPage', (url) => {
      if (url === this.url) {
        this.bntNext.classList.add('inactive');
      }
    });

    this.emitter.subscribe('firstPage', (url) => {
      if (url === this.url) {
        this.btnPrev.classList.add('inactive');
      }
    });

    this.emitter.subscribe('notLastPage', (url) => {
      if (url === this.url) {
        this.bntNext.classList.remove('inactive');
      }
    });

    this.emitter.subscribe('notFirstPage', (url) => {
      if (url === this.url) {
        this.btnPrev.classList.remove('inactive');
      }
    });
  }

  public update(url: string): void {
    this.url = url;
  }
}
