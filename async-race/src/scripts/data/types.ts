import { RouteCreator } from '../components/routeCreator';

export interface IRoute {
  text: string;
  url: string;
  Component: new () => RouteCreator;
  classes: string[];
}

export type Routs = IRoute[];
