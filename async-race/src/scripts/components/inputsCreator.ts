import { ApiQuery } from '../api/apiQuery';
import { EventEmitter } from '../emitter/emitter';
import { CarData } from '../types/dataTypes';
import { RandomGenerator } from '../util/randomGeneration';
import { Creator } from './creator';

export class InputsCreator extends Creator {
  private inputs!: HTMLElement;
  private inputsCreate!: HTMLElement;
  private inputCreate!: HTMLInputElement;
  private createColorizer!: HTMLInputElement;
  private btnCreate!: HTMLElement;
  private inputsUpdate!: HTMLElement;
  private inputUpdate!: HTMLInputElement;
  private updateColorizer!: HTMLInputElement;
  private btnUpdate!: HTMLElement;
  private inputsOpt!: HTMLElement;
  private btnRace!: HTMLElement;
  private btnReset!: HTMLElement;
  private btnGenerate!: HTMLElement;

  private selectedCar: CarData | null = null;

  constructor(protected emitter: EventEmitter) {
    super(emitter);
  }

  public render(parent: HTMLElement): void {
    this.inputs = Creator.renderElem(parent, 'div', ['inputs']);
    this.inputsCreate = Creator.renderElem(this.inputs, 'div', ['inputs__create']);
    this.inputCreate = Creator.renderElem(this.inputsCreate, 'input', ['input', 'input_create'], null, 'text') as HTMLInputElement;
    this.createColorizer = Creator.renderElem(this.inputsCreate, 'input', ['colorizer'], null, 'color') as HTMLInputElement;
    this.btnCreate = Creator.renderElem(this.inputsCreate, 'div', ['btn', 'btn_create'], 'Create');

    this.inputsUpdate = Creator.renderElem(this.inputs, 'div', ['inputs__update']);
    this.inputUpdate = Creator.renderElem(this.inputsUpdate, 'input', ['input', 'input_update'], null, 'text') as HTMLInputElement;
    if (this.inputUpdate instanceof HTMLInputElement) this.inputUpdate.disabled = true;
    this.updateColorizer = Creator.renderElem(this.inputsUpdate, 'input', ['colorizer'], null, 'color') as HTMLInputElement;
    this.btnUpdate = Creator.renderElem(this.inputsUpdate, 'div', ['btn', 'btn_update'], 'Update');

    this.inputsOpt = Creator.renderElem(this.inputs, 'div', ['inputs__opt']);
    this.btnRace = Creator.renderElem(this.inputsOpt, 'div', ['btn', 'btn_race'], 'Race');
    this.btnReset = Creator.renderElem(this.inputsOpt, 'div', ['btn', 'btn_reset', 'inactive'], 'Reset');
    this.btnGenerate = Creator.renderElem(this.inputsOpt, 'div', ['btn', 'btn_generate'], 'Generate');

    this.bindEvents();
    this.subscribeEvents();
  }

  private bindEvents(): void {
    this.btnCreate.addEventListener('click', () => this.createCar());
    this.btnUpdate.addEventListener('click', () => this.updateCar());
    this.btnGenerate.addEventListener('click', () => this.generateCar());
    this.btnRace.addEventListener('click', () => this.startRace());
    this.btnReset.addEventListener('click', () => this.resetRace());
  }

  private subscribeEvents(): void {
    this.emitter.subscribe<CarData>('selectCar', (data) => this.selectCar(data));
    this.emitter.subscribe<number>('disableSelect', (id) => {
      if (this.selectedCar?.id === id) {
        this.inputUpdate.disabled = true;
        this.btnUpdate.classList.add('inactive');
      }
    });
    this.emitter.subscribe<number>('enableSelect', (id) => {
      if (this.selectedCar?.id === id) {
        this.inputUpdate.disabled = false;
        this.btnUpdate.classList.remove('inactive');
      }
    });
  }

  private async createCar(): Promise<void> {
    // eslint-disable-next-line max-len
    if (!(this.inputCreate instanceof HTMLInputElement) || !(this.createColorizer instanceof HTMLInputElement)) return;
    const name = this.inputCreate.value;
    const color = this.createColorizer.value;
    const response = await ApiQuery.create('garage', { name, color });
    this.emitter.emit('createCar', response);

    this.inputCreate.value = '';
    this.createColorizer.value = '#000000';
  }

  private selectCar(data: CarData): void {
    if (this.inputUpdate instanceof HTMLInputElement) {
      this.inputUpdate.disabled = false;
      this.inputUpdate.focus();
      this.selectedCar = data;
    }
  }

  private async updateCar(): Promise<void> {
    if (this.selectedCar && !this.btnUpdate.classList.contains('inactive')) {
      const color = this.updateColorizer.value;
      const name = this.inputUpdate.value;
      const { id } = this.selectedCar;
      await ApiQuery.update('garage', id, { name, color });
      this.emitter.emit('updateCar', { name, color, id });

      this.updateColorizer.value = '#000000';
      this.inputUpdate.value = '';
      this.selectedCar = null;
      this.inputUpdate.disabled = true;
    }
  }

  private async generateCar(): Promise<void> {
    const randomCars = RandomGenerator.generateCarsData();
    const promises = randomCars.map((car) => ApiQuery.create('garage', car));
    const carsData = await Promise.all(promises);

    this.emitter.emit('generateCars', carsData);
  }

  private startRace(): void {
    if (!this.btnRace.classList.contains('inactive')) {
      this.btnRace.classList.add('inactive');
      this.emitter.emit('startRace', this.btnReset);
    }
  }

  private resetRace(): void {
    if (!this.btnReset.classList.contains('inactive')) {
      this.btnReset.classList.add('inactive');
      this.btnRace.classList.remove('inactive');
      this.emitter.emit('resetRace', null);
    }
  }
}
