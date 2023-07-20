/* eslint-disable no-param-reassign */
import { ApiQuery } from '../api/apiQuery';
import { CarData, ResultData, WinResults } from '../types/dataTypes';
import { createSvg } from '../util/createSvg';
import { Creator } from './creator';
import { RouteCreator } from './routeCreator';

export class WinnersCreator extends RouteCreator {
  public url = 'winners';
  protected page = 1;
  protected quantity = 10;
  public elems: ResultData[] = [];
  private resElems: HTMLElement[][] = [];
  private heads: HTMLElement[] = [];

  private winners!: HTMLElement;
  protected titleElem!: HTMLElement;
  protected pageElem!: HTMLElement;
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
  private timeHead!: HTMLElement;

  public render(parent: HTMLElement): void {
    super.render(parent);

    this.winners = Creator.renderElem(this.container, 'div', ['winners']);
    this.titleElem = Creator.renderElem(this.winners, 'h2', ['winners__header'], 'Winners');
    this.pageElem = Creator.renderElem(this.winners, 'h3', ['winners__pages'], 'Page');

    this.table = Creator.renderElem(this.winners, 'div', ['table']);
    this.tableNumber = Creator.renderElem(this.table, 'div', ['table__number']);
    this.numberHead = Creator.renderElem(this.tableNumber, 'div', ['table__head'], 'Number');
    this.tableCar = Creator.renderElem(this.table, 'div', ['table__car', 'Car']);
    this.carHead = Creator.renderElem(this.tableCar, 'div', ['table__head'], 'Car');
    this.tableName = Creator.renderElem(this.table, 'div', ['table__name']);
    this.nameHead = Creator.renderElem(this.tableName, 'div', ['table__head'], 'Name');
    this.tableWins = Creator.renderElem(this.table, 'div', ['table__wins']);
    this.winsHead = Creator.renderElem(this.tableWins, 'div', ['table__head', 'btn_sort'], 'Wins');
    this.tableTime = Creator.renderElem(this.table, 'div', ['table__time']);
    this.timeHead = Creator.renderElem(this.tableTime, 'div', ['table__head', 'btn_sort'], 'Best time (seconds)');

    this.heads.push(this.numberHead, this.carHead, this.nameHead, this.winsHead, this.timeHead);
    this.heads.forEach((el, index) => {
      const head = el;
      head.dataset.index = String(index);
    });

    ApiQuery.getAll<ResultData>('winners').then((data) => this.setResults(data));
    this.subscribeEvents();
    this.bindEvents();
  }

  private bindEvents(): void {
    this.heads.forEach((head) => {
      if (head.classList.contains('btn_sort')) {
        head.addEventListener('click', () => {
          this.sortListner(head);
        });
      }
    });
  }

  protected subscribeEvents(): void {
    this.emitter.subscribe('deleteCar', (id: number) => {
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

    this.emitter.subscribe('winRace', (results: WinResults) => {
      this.updateAfterWin(results);
    });
  }

  // //////////// methods

  private setResults(data: ResultData[]): void {
    this.elems = [];
    this.resElems = [];

    data.forEach((winner) => {
      const { id } = winner;
      const number = data.indexOf(winner) + 1;
      const numberItem = Creator.renderElem(this.tableNumber, 'div', ['win-number'], String(number));
      const carItem = Creator.renderElem(this.tableCar, 'div', ['win-car']);
      const nameItem = Creator.renderElem(this.tableName, 'div', ['win-name']);
      const winsItem = Creator.renderElem(this.tableWins, 'div', ['win-count'], String(winner.wins));
      const timeItem = Creator.renderElem(this.tableTime, 'div', ['win-time'], String(winner.time));

      ApiQuery.get<CarData>('garage', id).then((car) => {
        const { name, color } = car;
        const svg = createSvg(color, ['table__img']);
        carItem.append(svg);
        nameItem.textContent = name;
      });

      this.resElems.push([numberItem, carItem, nameItem, winsItem, timeItem]);
      this.elems.push(winner);
    });

    this.updateTitleQuantity();
    this.setActiveElems();
  }

  protected setActiveElems(): void {
    this.hideTableElems();
    const activeCars = this.getActiveElems(this.resElems);
    activeCars.forEach((rowElems) => rowElems.forEach((el) => el.classList.remove('inactive')));

    this.setPageBtn(this.elems);
    this.updatePagesQuantity();
  }

  private removeTableElems(): void {
    this.resElems.forEach((rowElems) => rowElems.forEach((el) => el.remove()));
  }

  private hideTableElems(): void {
    this.resElems.forEach((rowElems) => rowElems.forEach((el) => el.classList.add('inactive')));
  }

  // Car-changing

  protected updateCarListner(data: CarData): void {
    const { id } = data;
    const updatedCar = this.elems.find((car) => car.id === id);
    if (updatedCar) {
      this.removeTableElems();
      this.setResults(this.elems);
    }
  }

  protected deleteCarListner(id: number): void {
    const deletedCar = this.elems.find((car) => car.id === id);
    if (deletedCar) {
      const index = this.elems.indexOf(deletedCar);
      this.elems.splice(index, 1);
      ApiQuery.delete('winners', id);
      this.removeTableElems();
      this.setResults(this.elems);
    }
  }

  // Win-updating

  private updateAfterWin({ id, time }: WinResults): void {
    const curRes = this.elems.find((el) => id === el.id);
    if (curRes) {
      WinnersCreator.updateResult(curRes, id, time);
    } else {
      this.createNewResult(id, time);
    }
    this.removeTableElems();
    this.setResults(this.elems);
  }

  private static updateResult(curRes: ResultData, id: number, time: number): void {
    curRes.wins += 1;
    const bestTime = Math.min(time, curRes.time);
    curRes.time = bestTime;
    ApiQuery.update('winners', id, { wins: curRes.wins, time: bestTime });
  }

  private createNewResult(id: number, time: number): void {
    const newElem: ResultData = {
      wins: 1,
      id,
      time,
    };
    this.elems.push(newElem);
    ApiQuery.create('winners', newElem);
  }

  // Sort

  private sortListner(head: HTMLElement): void {
    const status = head.classList.contains('up') ? 'down' : 'up';
    this.removeSortStatus();
    head.classList.add(status);
    this.sortTable(Number(head.dataset.index), status);
  }

  private sortTable(index: number, status: string): void {
    const sortedArr = this.resElems.sort((a, b) => {
      const first = Number(a[index].textContent);
      const second = Number(b[index].textContent);
      if (Number.isNaN(first) || Number.isNaN(second)) return 0;
      if (status === 'up') {
        if (first > second) return 1;
        if (first < second) return -1;
      }
      if (status === 'down') {
        if (first < second) return 1;
        if (first > second) return -1;
      }
      return 0;
    });
    this.removeTableElems();
    this.setSortedResults(sortedArr);
    this.setActiveElems();
  }

  private setSortedResults(data: HTMLElement[][]): void {
    data.forEach((row, index) => {
      const [number, image, name, wins, time] = row;
      number.textContent = String(index + 1);

      this.tableNumber.append(number);
      this.tableCar.append(image);
      this.tableName.append(name);
      this.tableWins.append(wins);
      this.tableTime.append(time);
    });
  }

  private removeSortStatus(): void {
    this.heads.forEach((head) => {
      head.classList.remove('up', 'down');
    });
  }
}
