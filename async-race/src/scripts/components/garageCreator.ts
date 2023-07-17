import { ApiQuery } from '../api/apiQuery';
import { CarData } from '../types/dataTypes';
import { CarCreator } from './carCreator';
import { Creator } from './creator';
import { InputsCreator } from './inputsCreator';
import { RouteCreator } from './routeCreator';

export class GarageCreator extends RouteCreator {
  public url = 'garage';
  public elems: CarCreator[] = [];
  protected page = 1;
  protected quantity = 7;

  private inputs!: HTMLElement;
  private garage!: HTMLElement;
  protected garageTitle!: HTMLElement;
  protected pageElem!: HTMLElement;

  public render(parent: HTMLElement): void {
    super.render(parent);

    const inputsCreator = new InputsCreator(this.emitter);
    inputsCreator.render(this.container);

    this.garage = Creator.renderElem(this.container, 'div', ['garage__header']);
    this.titleElem = Creator.renderElem(this.garage, 'h2', ['garage__header'], 'Garage');
    this.pageElem = Creator.renderElem(this.garage, 'h3', ['garage__pages'], 'Page');

    ApiQuery.getAll<CarData>(this.url).then((carItems) => this.renderCars(carItems));
    this.subscribeEvents();
  }

  protected subscribeEvents(): void {
    this.emitter.subscribe('createCar', (carData: CarData) => {
      this.renderCar(carData);
    });

    this.emitter.subscribe<number>('deleteCar', (id) => {
      this.deleteCarListner(id);
    });

    this.emitter.subscribe<CarData>('updateCar', (data) => {
      this.updateCarListner(data);
    });

    this.emitter.subscribe<CarData[]>('generateCars', (data) => {
      this.renderCars(data);
    });

    this.emitter.subscribe<string>('nextPage', (url) => {
      this.nextPageListner(url);
    });
    this.emitter.subscribe<string>('prevPage', (url) => {
      this.prevPageListner(url);
    });
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
}
