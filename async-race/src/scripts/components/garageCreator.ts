import { ApiQuery } from '../api/apiQuery';
import { Race } from '../race/race';
import { CarData } from '../types/dataTypes';
import { CarCreator } from './carCreator';
import { Creator } from './creator';
import { InputsCreator } from './inputsCreator';
import { ModalResult } from './modal';
import { RouteCreator } from './routeCreator';

export class GarageCreator extends RouteCreator {
  public url = 'garage';
  public elems: CarCreator[] = [];
  protected page = 1;
  protected quantity = 7;

  private modal = new ModalResult(this.emitter);
  private inputs!: HTMLElement;
  private garage!: HTMLElement;
  protected garageTitle!: HTMLElement;
  protected pageElem!: HTMLElement;

  private startedCars: CarCreator[] = [];

  public render(parent: HTMLElement): void {
    super.render(parent);

    const inputsCreator = new InputsCreator(this.emitter);
    inputsCreator.render(this.container);

    this.garage = Creator.renderElem(this.container, 'div', ['garage__header']);
    this.titleElem = Creator.renderElem(this.garage, 'h2', ['garage__header'], 'Garage');
    this.pageElem = Creator.renderElem(this.garage, 'h3', ['garage__pages'], 'Page');

    ApiQuery.getAll<CarData>(this.url).then((carItems) => this.renderCars(carItems));
    this.subscribeEvents();

    this.modal.render(parent);
  }

  protected subscribeEvents(): void {
    this.emitter.subscribe<CarData>('createCar', (carData) => this.renderCar(carData));
    this.emitter.subscribe<number>('deleteCar', (id) => this.deleteCarListner(id));
    this.emitter.subscribe<CarData>('updateCar', (data) => this.updateCarListner(data));
    this.emitter.subscribe<CarData[]>('generateCars', (data) => this.renderCars(data));
    this.emitter.subscribe<string>('nextPage', (url) => this.nextPageListner(url));
    this.emitter.subscribe<string>('prevPage', (url) => this.prevPageListner(url));
    this.emitter.subscribe<HTMLElement>('startRace', (btnReset) => this.startRace(btnReset));
    this.emitter.subscribe('resetRace', () => this.resetRace());
  }

  private renderCars(carData: CarData[]): void {
    carData.forEach((car) => {
      this.renderCar(car);
    });
  }

  private renderCar(car: CarData): void {
    const carInstance = new CarCreator(this.emitter, car);
    carInstance.render(this.garage);
    this.elems.push(carInstance);
    this.updateTitleQuantity();
    this.setActiveElems();
  }

  protected setActiveElems(): void {
    const activeCars = this.getActiveElems(this.elems);
    this.elems.forEach((car) => car.hide());
    activeCars.forEach((car) => car.show());

    this.setPageBtn(this.elems);
    this.updatePagesQuantity();
  }

  protected updateCarListner(data: CarData): void {
    const { id } = data;
    const updatedCar = this.elems.find((car) => car.id === id);
    if (updatedCar) {
      updatedCar.updateCar(data);
    }
  }

  protected deleteCarListner(id: number): void {
    const deletedCar = this.elems.find((car) => car.id === id);
    if (deletedCar) {
      const index = this.elems.indexOf(deletedCar);
      this.elems.splice(index, 1);
      this.updateTitleQuantity();
      this.setActiveElems();

      const activeCars = this.getActiveElems(this.elems);
      if (!activeCars.length && this.page > 1) {
        this.prevPageListner(this.url);
      }
    }
  }

  private async startRace(btnReset: HTMLElement): Promise<void> {
    this.startedCars = this.getActiveElems(this.elems);
    Race.isRace = true;
    const allStarted = this.startedCars.map((car) => car.startCar());
    await Promise.allSettled(allStarted);

    btnReset.classList.remove('inactive');
  }

  private resetRace(): void {
    Race.isRace = false;
    Race.isWin = false;
    this.startedCars.forEach((car) => car.stopCar());
    this.startedCars = [];
  }
}
