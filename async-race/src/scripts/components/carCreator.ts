import { EventEmitter } from '../emitter/emitter';
import { CarData } from '../types/carDataType';
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
  private carSvg!: HTMLElement;
  private carFlag!: HTMLElement;

  private id = this.carData.id;
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
    this.carSvg = CarCreator.createSvg(this.color);
    this.carRoad.append(this.carSvg);
    this.carFlag = Creator.renderElem(this.carRoad, 'div', ['car__flag']);
  }

  private static createSvg(color: string): HTMLElement {
    const svgObject = document.createElement('object');

    svgObject.data = './img/car_gdhlhrosi4v1..svg';
    svgObject.type = 'image/svg+xml';
    svgObject.classList.add('car__instance');

    svgObject.onload = (): void => {
      const svgDoc = svgObject.contentDocument;
      if (!svgDoc) return;
      const svgElement = svgDoc.querySelector('svg');
      if (!svgElement) return;
      const path = svgElement.querySelector<SVGPathElement>('.true-fill');
      if (path) path.style.fill = color;
    };
    return svgObject;
  }
}
