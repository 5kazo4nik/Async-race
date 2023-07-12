import { Creator } from '../components/creator';
import { FooterCreator } from '../components/footerCreator';
import { HeaderCreator } from '../components/headerCreator';
import { RouteCreator } from '../components/routeCreator';
import { ROUTS } from '../data/routes';
import { IRoute } from '../data/types';

export class AppCreator extends Creator {
  private container = document.body;
  private header = new HeaderCreator(this.emitter, ROUTS);
  private footer = new FooterCreator(this.emitter);
  private windows: RouteCreator[] = [];
  private curWindowIndex = 0;

  public render(): void {
    ROUTS.forEach((route: IRoute) => {
      const Component = new route.Component();
      Component.render(this.container);
      this.windows.push(Component);
    });

    this.emitter.subscribe('changeRoute', (route: IRoute) => this.changeRoute(route));

    this.header.render(this.container);
    this.footer.render(this.container);
  }

  private changeRoute(route: IRoute): void {
    const activeWindow = this.windows.find((window) => route.url === window.url);
    const inactiveWindow = this.windows.filter((window) => window.url !== route.url);
    activeWindow?.show();
    inactiveWindow.forEach((window) => window.hide());

    if (activeWindow) this.updateFooter(activeWindow);
  }

  private updateFooter(activeWindow: RouteCreator): void {
    const index = this.windows.indexOf(activeWindow);
    if (index !== this.curWindowIndex) {
      this.footer.update(this.container);
      this.curWindowIndex = index;
    }
  }
}
