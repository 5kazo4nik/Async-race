import { ApiQuery } from '../api/apiQuery';
import { CarData } from '../types/dataTypes';
import { CarCreator } from './carCreator';
import { Creator } from './creator';
import { InputsCreator } from './inputsCreator';
import { RouteCreator } from './routeCreator';

export class GarageCreator extends RouteCreator {
  public url = 'garage';

  private inputs!: HTMLElement;
  private garage!: HTMLElement;
  private garageTitle!: HTMLElement;
  private garagePage!: HTMLElement;

  private cars: CarCreator[] = [];

  public render(parent: HTMLElement): void {
    super.render(parent);

    const inputsCreator = new InputsCreator(this.emitter);
    inputsCreator.render(this.container);

    this.garage = Creator.renderElem(this.container, 'div', ['garage__header']);
    this.garageTitle = Creator.renderElem(this.garage, 'h2', ['garage__header'], 'Garage');
    this.garagePage = Creator.renderElem(this.garage, 'h3', ['garage__pages'], 'Page');

    ApiQuery.getAll<CarData>(this.url).then((carItems) => this.renderCars(carItems));
    this.subscribeEvents();
  }

  private subscribeEvents(): void {
    this.emitter.subscribe('createCar', (carData: CarData) => {
      this.renderCar(carData);
    });

    this.emitter.subscribe('deleteCar', (id: number) => {
      const deletedCar = this.cars.find((car) => car.id === id);
      if (deletedCar) {
        const index = this.cars.indexOf(deletedCar);
        this.cars.splice(index, 1);
      }
    });

    this.emitter.subscribe('updateCar', (data: CarData) => {
      const { id } = data;
      const updatedCar = this.cars.find((car) => car.id === id);
      if (updatedCar) {
        updatedCar.updateCar(data);
      }
    });

    this.emitter.subscribe<CarData[]>('generateCars', (data) => {
      data.forEach((car) => this.renderCar(car));
    });
  }

  private renderCars(carData: CarData[]): void {
    this.cars = [];
    carData.forEach((car) => {
      this.renderCar(car);
    });
  }

  private renderCar(car: CarData): void {
    const carInstance = new CarCreator(this.emitter, car);
    carInstance.render(this.garage);
    this.cars.push(carInstance);
  }
}
