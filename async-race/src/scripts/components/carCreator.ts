import { ApiQuery } from '../api/apiQuery';
import { EventEmitter } from '../emitter/emitter';
import { CarData } from '../types/dataTypes';
import { createSvg } from '../util/createSvg';
import { Creator } from './creator';

export class CarCreator extends Creator {
  private carWrapper!: HTMLElement;
  private carOpt!: HTMLElement;
  private btnSelect!: HTMLElement;
  private btnRemove!: HTMLElement;
  private carName!: HTMLElement;
  private carEngine!: HTMLElement;
  private btnStart!: HTMLElement;
  private btnStop!: HTMLElement;
  private carRoad!: HTMLElement;
  private carSvg!: HTMLObjectElement;
  private carFlag!: HTMLElement;

  public id = this.carData.id;
  private color = this.carData.color;
  private name = this.carData.name;

  constructor(protected emitter: EventEmitter, private carData: CarData) {
    super(emitter);
  }

  public render(parent: HTMLElement): void {
    this.carWrapper = Creator.renderElem(parent, 'div', ['car']);

    this.carOpt = Creator.renderElem(this.carWrapper, 'div', ['car__opt']);
    this.btnSelect = Creator.renderElem(this.carOpt, 'div', ['btn', 'btn_select'], 'select');
    this.btnRemove = Creator.renderElem(this.carOpt, 'div', ['btn', 'btn_remove'], 'remove');
    this.carName = Creator.renderElem(this.carOpt, 'div', ['car__name'], this.carData.name);

    this.carEngine = Creator.renderElem(this.carWrapper, 'div', ['car__engine']);
    this.btnStart = Creator.renderElem(this.carEngine, 'div', ['car__start'], 'A');
    this.btnStop = Creator.renderElem(this.carEngine, 'div', ['car__stop', 'inactive'], 'B');

    this.carRoad = Creator.renderElem(this.carWrapper, 'div', ['car__road']);
    this.carSvg = createSvg(this.color, ['car__instance']);
    this.carRoad.append(this.carSvg);
    this.carFlag = Creator.renderElem(this.carRoad, 'div', ['car__flag']);

    this.bindEvents();
  }

  private bindEvents(): void {
    this.btnRemove.addEventListener('click', () => this.deleteCar());
    this.btnSelect.addEventListener('click', () => this.selectCar());
  }

  private deleteCar(): void {
    this.carWrapper.remove();
    ApiQuery.delete('winners', this.id);
    ApiQuery.delete('garage', this.id);
    this.emitter.emit('deleteCar', this.id);
  }

  private selectCar(): void {
    this.emitter.emit('selectCar', { id: this.id, color: this.color, name: this.name });
  }

  public updateCar(data: CarData): void {
    this.name = data.name;
    this.color = data.color;
    const newSvg = createSvg(this.color, ['car__instance']);
    this.carSvg.replaceWith(newSvg);
    this.carSvg = newSvg;
    this.carName.textContent = this.name;
  }
}
