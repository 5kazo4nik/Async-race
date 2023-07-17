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
  private page = 1;
  private quantity = 7;

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
    this.cars.push(carInstance);
    this.updateTitleQuantity(this.cars.length);
    this.setActiveElems();
  }

  private updateTitleQuantity(num: number): void {
    this.garageTitle.textContent = `Garage (${num})`;
  }

  private setActiveElems(): void {
    const activeCars = this.getActiveElems();
    this.cars.forEach((car) => car.hide());
    activeCars.forEach((car) => car.show());

    this.setPageBtn();
    this.updatePagesQuantity();
  }

  private getActiveElems(): CarCreator[] {
    let activeCars;
    const end = this.quantity * this.page;
    const start = this.page === 1 ? 0 : end - this.quantity;

    if (this.cars.length > this.quantity) {
      activeCars = this.cars.slice(start, end);
    } else {
      activeCars = this.cars.slice(start);
    }
    return activeCars;
  }

  public setPageBtn(): void {
    const end = this.quantity * this.page;
    if (this.page === 1) {
      this.emitter.emit('firstPage', this.url);
    } else {
      this.emitter.emit('notFirstPage', this.url);
    }

    if (this.cars.length > this.quantity) {
      this.emitter.emit('notLastPage', this.url);
    } else {
      this.emitter.emit('lastPage', this.url);
    }
    const nextPageCars = this.cars.slice(end);
    if (!nextPageCars.length) this.emitter.emit('lastPage', this.url);
  }

  private updatePagesQuantity(): void {
    this.garagePage.textContent = `Page #${this.page}`;
  }

  private prevPageListner(url: string): void {
    if (this.url === url) {
      this.page -= 1;
      this.setActiveElems();
    }
  }

  private nextPageListner(url: string): void {
    if (this.url === url) {
      this.page += 1;
      this.setActiveElems();
    }
  }

  private updateCarListner(data: CarData): void {
    const { id } = data;
    const updatedCar = this.cars.find((car) => car.id === id);
    if (updatedCar) {
      updatedCar.updateCar(data);
    }
  }

  private deleteCarListner(id: number): void {
    const deletedCar = this.cars.find((car) => car.id === id);
    if (deletedCar) {
      const index = this.cars.indexOf(deletedCar);
      this.cars.splice(index, 1);
      this.updateTitleQuantity(this.cars.length);
      this.setActiveElems();

      const activeCars = this.getActiveElems();
      if (!activeCars.length && this.page > 1) {
        this.prevPageListner(this.url);
      }
    }
  }
}
