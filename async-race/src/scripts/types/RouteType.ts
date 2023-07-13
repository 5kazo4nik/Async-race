import { RouteCreator } from '../components/routeCreator';
import { EventEmitter } from '../emitter/emitter';

export interface IRoute {
  text: string;
  url: string;
  Component: new (emitter: EventEmitter, data?: unknown) => RouteCreator;
  classes: string[];
}

export type Routs = IRoute[];
