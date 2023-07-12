import { Creator } from './creator';
import { RouteCreator } from './routeCreator';

export class GarageCreator extends RouteCreator {
  public url = 'garage';

  private inputs!: HTMLElement;
  private inputsCreate!: HTMLElement;
  private inputCreate!: HTMLElement;
  private createColorizer!: HTMLElement;
  private btnCreate!: HTMLElement;
  private inputsUpdate!: HTMLElement;
  private inputUpdate!: HTMLElement;
  private updateColorizer!: HTMLElement;
  private inputsOpt!: HTMLElement;
  private btnRace!: HTMLElement;
  private btnReset!: HTMLElement;
  private btnGenerate!: HTMLElement;
  private garage!: HTMLElement;
  private garageTitle!: HTMLElement;
  private garagePage!: HTMLElement;

  public render(parent: HTMLElement): void {
    super.render(parent);
    this.inputs = Creator.renderElem(this.container, 'div', ['inputs']);

    this.inputsCreate = Creator.renderElem(this.inputs, 'div', ['inputs__create']);
    this.inputCreate = Creator.renderElem(this.inputsCreate, 'input', ['input', 'input_create'], null, 'text');
    this.createColorizer = Creator.renderElem(this.inputsCreate, 'input', ['colorizer'], null, 'color');
    this.btnCreate = Creator.renderElem(this.inputsCreate, 'div', ['btn', 'btn_create'], 'Create');

    this.inputsUpdate = Creator.renderElem(this.inputs, 'div', ['inputs__update']);
    this.inputUpdate = Creator.renderElem(this.inputsUpdate, 'input', ['input', 'input_update'], null, 'text');
    if (this.inputUpdate instanceof HTMLInputElement) this.inputUpdate.disabled = true;
    this.updateColorizer = Creator.renderElem(this.inputsUpdate, 'input', ['colorizer'], null, 'color');
    this.inputsUpdate = Creator.renderElem(this.inputsUpdate, 'div', ['btn', 'btn_update'], 'Update');

    this.inputsOpt = Creator.renderElem(this.inputs, 'div', ['inputs__opt']);
    this.btnRace = Creator.renderElem(this.inputsOpt, 'div', ['btn', 'btn_race'], 'Race');
    this.btnReset = Creator.renderElem(this.inputsOpt, 'div', ['btn', 'btn_reset'], 'Reset');
    this.btnGenerate = Creator.renderElem(this.inputsOpt, 'div', ['btn', 'btn_generate'], 'Generate');

    this.garage = Creator.renderElem(this.container, 'div', ['garage__header']);
    this.garageTitle = Creator.renderElem(this.garage, 'h2', ['garage__header'], 'Garage');
    this.garagePage = Creator.renderElem(this.garage, 'h3', ['garage__pages'], 'Page');
  }
}
