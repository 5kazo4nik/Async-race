import { IRoute, Routs } from '../data/types';
import { EventEmitter } from '../emitter/emitter';
import { Creator } from './creator';

export class HeaderCreator extends Creator {
  private header!: HTMLElement;
  private buttons: HTMLElement[] = [];

  constructor(protected readonly emitter: EventEmitter, private routes: Routs) {
    super(emitter);
  }

  public render(parent: HTMLElement): void {
    this.header = Creator.renderElem(parent, 'header');

    this.routes.forEach((route: IRoute) => {
      const btn = Creator.renderElem(this.header, 'div', route.classes, route.text);
      btn.dataset.url = route.url;
      this.buttons.push(btn);
    });

    this.changeRoute(this.routes[0]);

    this.header.addEventListener('click', (e) => {
      const { target } = e;
      if (target instanceof HTMLElement && target.classList.contains('btn')) {
        const curRoute = this.routes.find((route) => route.url === target.dataset.url);
        if (curRoute) this.changeRoute(curRoute);
      }
    });
  }

  private changeRoute(route: IRoute): void {
    const curElem = this.buttons.find((btn) => btn.dataset.url === route.url);
    const activeElems = this.buttons.filter((btn) => btn.dataset.url !== route.url);

    curElem?.classList.add('inactive');
    activeElems.forEach((btn) => btn.classList.remove('inactive'));

    this.emitter.emit('changeRoute', route);
  }
}
