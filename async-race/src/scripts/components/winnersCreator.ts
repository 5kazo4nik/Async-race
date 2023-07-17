import { ApiQuery } from '../api/apiQuery';
import { CarData, ResultData } from '../types/dataTypes';
import { createSvg } from '../util/createSvg';
import { Creator } from './creator';
import { RouteCreator } from './routeCreator';

export class WinnersCreator extends RouteCreator {
  public url = 'winners';

  private winners!: HTMLElement;
  private winnersTitle!: HTMLElement;
  private winnersPage!: HTMLElement;
  private table!: HTMLElement;
  private tableNumber!: HTMLElement;
  private numberHead!: HTMLElement;
  private tableCar!: HTMLElement;
  private carHead!: HTMLElement;
  private tableName!: HTMLElement;
  private nameHead!: HTMLElement;
  private tableWins!: HTMLElement;
  private winsHead!: HTMLElement;
  private tableTime!: HTMLElement;
  private tableHead!: HTMLElement;

  private carsRes: ResultData[] = [];
  private resElems: HTMLElement[][] = [];

  private page = 1;
  private quantity = 10;

  public render(parent: HTMLElement): void {
    super.render(parent);

    this.winners = Creator.renderElem(this.container, 'div', ['winners']);
    this.winnersTitle = Creator.renderElem(this.winners, 'h2', ['winners__header'], 'Winners');
    this.winnersPage = Creator.renderElem(this.winners, 'h3', ['winners__pages'], 'Page');

    this.table = Creator.renderElem(this.winners, 'div', ['table']);
    this.tableNumber = Creator.renderElem(this.table, 'div', ['table__number']);
    this.numberHead = Creator.renderElem(this.tableNumber, 'div', ['table__head'], 'Number');
    this.tableCar = Creator.renderElem(this.table, 'div', ['table__car', 'Car']);
    this.carHead = Creator.renderElem(this.tableCar, 'div', ['table__head', 'Car'], 'Car');
    this.tableName = Creator.renderElem(this.table, 'div', ['table__name']);
    this.nameHead = Creator.renderElem(this.tableName, 'div', ['table__head'], 'Name');
    this.tableWins = Creator.renderElem(this.table, 'div', ['table__wins']);
    this.winsHead = Creator.renderElem(this.tableWins, 'div', ['table__head'], 'Wins');
    this.tableTime = Creator.renderElem(this.table, 'div', ['table__time']);
    this.tableHead = Creator.renderElem(this.tableTime, 'div', ['table__head'], 'Best time (seconds)');

    ApiQuery.getAll<ResultData>('winners').then((data) => this.setResults(data));
    this.subscribeEvents();
  }

  private subscribeEvents(): void {
    this.emitter.subscribe<number>('deleteCar', (id) => {
      this.deleteCarListner(id);
    });

    this.emitter.subscribe('updateCar', (data: CarData) => {
      this.updateCarListner(data);
    });

    this.emitter.subscribe('nextPage', (url: string) => {
      this.nextPageListner(url);
    });

    this.emitter.subscribe('prevPage', (url: string) => {
      this.prevPageListner(url);
    });
  }

  private setResults(data: ResultData[]): void {
    this.carsRes = [];
    this.resElems = [];

    data.forEach((winner) => {
      const { id } = winner;
      const number = data.indexOf(winner) + 1;
      const numberItem = Creator.renderElem(this.tableNumber, 'div', ['win-number'], String(number));
      const winsItem = Creator.renderElem(this.tableWins, 'div', ['win-count'], String(winner.wins));
      const timeItem = Creator.renderElem(this.tableTime, 'div', ['win-time'], String(winner.time));
      const carItem = Creator.renderElem(this.tableCar, 'div', ['win-car']);
      const nameItem = Creator.renderElem(this.tableName, 'div', ['win-name']);

      ApiQuery.get<CarData>('garage', id).then((car) => {
        const { name, color } = car;
        const svg = createSvg(color, ['table__img']);
        carItem.append(svg);
        nameItem.textContent = name;
      });

      this.resElems.push([numberItem, winsItem, timeItem, carItem, nameItem]);
      this.carsRes.push(winner);
    });

    this.updateTitleQuantity(this.carsRes.length);
    this.setActiveElems();
  }

  private setActiveElems(): void {
    this.hideTableElems();
    const activeCars = this.getActiveElems();
    activeCars.forEach((rowElems) => rowElems.forEach((el) => el.classList.remove('inactive')));

    this.setPageBtn();
    this.updatePagesQuantity();
  }

  private getActiveElems(): HTMLElement[][] {
    let activeCars;
    const end = this.quantity * this.page;
    const start = this.page === 1 ? 0 : end - this.quantity;

    if (this.resElems.length > this.quantity) {
      activeCars = this.resElems.slice(start, end);
    } else {
      activeCars = this.resElems.slice(start);
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

    if (this.carsRes.length > this.quantity) {
      this.emitter.emit('notLastPage', this.url);
    } else {
      this.emitter.emit('lastPage', this.url);
    }
    const nextPageCars = this.carsRes.slice(end);
    if (!nextPageCars.length) this.emitter.emit('lastPage', this.url);
  }

  private updateTitleQuantity(num: number): void {
    this.winnersTitle.textContent = `Winners (${num})`;
  }

  private updatePagesQuantity(): void {
    this.winnersPage.textContent = `Page #${this.page}`;
  }

  private removeTableElems(): void {
    this.resElems.forEach((rowElems) => rowElems.forEach((el) => el.remove));
  }

  private hideTableElems(): void {
    this.resElems.forEach((rowElems) => rowElems.forEach((el) => el.classList.add('inactive')));
  }

  private deleteCarListner(id: number): void {
    const deletedCar = this.carsRes.find((car) => car.id === id);
    if (deletedCar) {
      ApiQuery.delete('winners', id);
      this.removeTableElems();
      this.setResults(this.carsRes);
    }
  }

  private updateCarListner(data: CarData): void {
    const { id } = data;
    const updatedCar = this.carsRes.find((car) => car.id === id);
    if (updatedCar) {
      this.removeTableElems();
      this.setResults(this.carsRes);
    }
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
}
