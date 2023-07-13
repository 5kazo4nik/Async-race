import { GarageCreator } from '../components/garageCreator';
import { WinnersCreator } from '../components/winnersCreator';
import { Routs } from '../types/RouteType';

export const ROUTS: Routs = [
  {
    text: 'To garage',
    url: 'garage',
    Component: GarageCreator,
    classes: ['btn', 'btn_garage'],
  },
  {
    text: 'To winners',
    url: 'winners',
    Component: WinnersCreator,
    classes: ['btn', 'btn_winners'],
  },
];
