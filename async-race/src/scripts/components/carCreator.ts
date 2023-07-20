import { ApiQuery } from '../api/apiQuery';
import { EventEmitter } from '../emitter/emitter';
import { Race } from '../race/race';
import { CarData, EngineData } from '../types/dataTypes';
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
  private isShown = false;
  public isDrive = false;
  private startPos = 25;

  constructor(protected emitter: EventEmitter, private carData: CarData) {
    super(emitter);
  }

  public render(parent: HTMLElement): void {
    this.carWrapper = Creator.renderElem(parent, 'div', ['car', 'inactive']);

    this.carOpt = Creator.renderElem(this.carWrapper, 'div', ['car__opt']);
    this.btnSelect = Creator.renderElem(this.carOpt, 'div', ['btn', 'btn_select'], 'select');
    this.btnRemove = Creator.renderElem(this.carOpt, 'div', ['btn', 'btn_remove'], 'remove');
    this.carName = Creator.renderElem(this.carOpt, 'div', ['car__name'], this.carData.name);

    this.carEngine = Creator.renderElem(this.carWrapper, 'div', ['car__engine']);
    this.btnStart = Creator.renderElem(this.carEngine, 'div', ['car__start'], 'A');
    this.btnStop = Creator.renderElem(this.carEngine, 'div', ['car__stop', 'inactive'], 'B');

    this.carRoad = Creator.renderElem(this.carWrapper, 'div', ['car__road']);
    this.carSvg = createSvg(this.color, ['car__instance', 'race']);
    this.carRoad.append(this.carSvg);
    this.carFlag = Creator.renderElem(this.carRoad, 'div', ['car__flag']);

    this.bindEvents();
  }

  private bindEvents(): void {
    this.btnRemove.addEventListener('click', () => this.deleteCar());
    this.btnSelect.addEventListener('click', () => this.selectCar());

    this.btnStart.addEventListener('click', () => {
      this.startCar();
    });

    this.btnStop.addEventListener('click', () => {
      this.stopCar();
    });
  }

  private deleteCar(): void {
    if (!this.btnRemove.classList.contains('inactive')) {
      this.carWrapper.remove();
      ApiQuery.delete('garage', this.id);
      this.emitter.emit('deleteCar', this.id);
    }
  }

  private selectCar(): void {
    if (!this.btnSelect.classList.contains('inactive')) {
      this.emitter.emit('selectCar', { id: this.id, color: this.color, name: this.name });
    }
  }

  public updateCar(data: CarData): void {
    this.name = data.name;
    this.color = data.color;
    const newSvg = createSvg(this.color, ['car__instance']);
    this.carSvg.replaceWith(newSvg);
    this.carSvg = newSvg;
    this.carName.textContent = this.name;
  }

  public async startCar(): Promise<void> {
    if (!this.btnStart.classList.contains('inactive')) {
      this.emitter.emit('disableSelect', this.id);
      this.btnStart.classList.add('inactive');
      this.btnSelect.classList.add('inactive');
      this.btnRemove.classList.add('inactive');
      const data = await ApiQuery.engine<EngineData>(this.id, 'started');
      data.id = this.id;
      data.name = this.name;
      data.flag = this.carFlag;
      data.car = this.carSvg;
      Race.start(data, this.emitter);
      this.btnStop.classList.remove('inactive');
      this.isDrive = true;
    }
  }

  public async stopCar(): Promise<void> {
    if (!this.btnStop.classList.contains('inactive')) {
      this.emitter.emit('enableSelect', this.id);
      ApiQuery.engine(this.id, 'stopped');
      Race.stop(this.id);
      Race.reset(this.carSvg, this.startPos);
      this.btnStop.classList.add('inactive');
      this.btnStart.classList.remove('inactive');
      this.btnSelect.classList.remove('inactive');
      this.btnRemove.classList.remove('inactive');
      this.isDrive = false;
    }
  }

  public show(): void {
    if (!this.isShown) {
      this.isShown = true;
      this.carWrapper.classList.remove('inactive');
    }
  }

  public hide(): void {
    if (this.isShown) {
      this.isShown = false;
      this.carWrapper.classList.add('inactive');
    }
  }
}
