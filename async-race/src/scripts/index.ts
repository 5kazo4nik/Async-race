import '../assets/svg/car_gdhlhrosi4v1.svg';
import '../styles/style.scss';
import { AppCreator } from './app/app';
import { EventEmitter } from './emitter/emitter';

const emitter = new EventEmitter();
const app = new AppCreator(emitter);
app.render();
