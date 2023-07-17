import { CarData } from '../types/dataTypes';
import { Creator } from './creator';

export abstract class RouteCreator extends Creator {
  public abstract url: string;
  protected abstract page: number;
  protected abstract quantity: number;
  protected abstract elems: unknown[];

  protected titleElem!: HTMLElement;
  protected pageElem!: HTMLElement;

  private parent!: HTMLElement;
  protected container!: HTMLElement;
  protected isShown = false;

  public render(parent: HTMLElement): void {
    this.parent = parent;
    this.container = document.createElement('div');
    this.container.classList.add('window-wrapper', 'inactive');
    this.parent.append(this.container);
  }

  protected abstract subscribeEvents(): void;
  protected abstract setActiveElems(): void;
  protected abstract updateCarListner(data: CarData): void;
  protected abstract deleteCarListner(id: number): void;

  protected getActiveElems<T>(arr: T[]): T[] {
    let activeCars;
    const end = this.quantity * this.page;
    const start = this.page === 1 ? 0 : end - this.quantity;

    if (arr.length > this.quantity) {
      activeCars = arr.slice(start, end);
    } else {
      activeCars = arr.slice(start);
    }
    return activeCars;
  }

  public setPageBtn<T>(arr: T[]): void {
    const end = this.quantity * this.page;
    if (this.page === 1) {
      this.emitter.emit('firstPage', this.url);
    } else {
      this.emitter.emit('notFirstPage', this.url);
    }

    if (arr.length > this.quantity) {
      this.emitter.emit('notLastPage', this.url);
    } else {
      this.emitter.emit('lastPage', this.url);
    }
    const nextPageCars = arr.slice(end);
    if (!nextPageCars.length) this.emitter.emit('lastPage', this.url);
  }

  protected updateTitleQuantity(): void {
    this.titleElem.textContent = `${this.url.slice(0, 1).toUpperCase() + this.url.slice(1)} (${this.elems.length})`;
  }

  protected updatePagesQuantity(): void {
    this.pageElem.textContent = `Page #${this.page}`;
  }

  protected prevPageListner(url: string): void {
    if (this.url === url) {
      this.page -= 1;
      this.setActiveElems();
    }
  }

  protected nextPageListner(url: string): void {
    if (this.url === url) {
      this.page += 1;
      this.setActiveElems();
    }
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
