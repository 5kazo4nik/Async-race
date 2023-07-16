import { Creator } from '../components/creator';
import { FooterCreator } from '../components/footerCreator';
import { HeaderCreator } from '../components/headerCreator';
import { RouteCreator } from '../components/routeCreator';
import { ROUTS } from '../data/routes';
import { IRoute } from '../types/RouteType';

export class AppCreator extends Creator {
  private body = document.body;
  private main = document.createElement('main');
  private header = new HeaderCreator(this.emitter, ROUTS);
  private footer = new FooterCreator(this.emitter);
  private windows: RouteCreator[] = [];
  private curWindowIndex: number | null = null;

  public render(): void {
    ROUTS.forEach((route: IRoute) => {
      const Component = new route.Component(this.emitter);
      Component.render(this.main);
      this.windows.push(Component);
    });

    this.emitter.subscribe('changeRoute', (route: IRoute) => this.changeRoute(route));

    this.header.render(this.body);
    this.body.append(this.main);
    this.footer.render(this.body);
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
      this.footer.update(activeWindow.url);
      this.curWindowIndex = index;
    }
  }
}
