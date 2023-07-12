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

  public render(parent: HTMLElement): void {
    super.render(parent);

    this.winners = Creator.renderElem(this.container, 'div', ['winners']);
    this.winnersTitle = Creator.renderElem(this.winners, 'h2', ['winners__header'], 'Winners');
    this.winnersPage = Creator.renderElem(this.winners, 'h3', ['winners__pages'], 'Page');

    this.table = Creator.renderElem(this.winners, 'div', ['table']);
    this.tableNumber = Creator.renderElem(this.table, 'div', ['table__number']);
    this.numberHead = Creator.renderElem(this.tableNumber, 'div', ['table__head'], 'Number');
    this.tableCar = Creator.renderElem(this.table, 'div', ['table__car', 'Car']);
    this.carHead = Creator.renderElem(this.tableCar, 'div', ['table__head', 'Car']);
    this.tableName = Creator.renderElem(this.table, 'div', ['table__name']);
    this.nameHead = Creator.renderElem(this.tableName, 'div', ['table__head'], 'Name');
    this.tableWins = Creator.renderElem(this.table, 'div', ['table__wins']);
    this.winsHead = Creator.renderElem(this.tableWins, 'div', ['table__head'], 'Wins');
    this.tableTime = Creator.renderElem(this.table, 'div', ['table__time']);
    this.tableHead = Creator.renderElem(this.tableTime, 'div', ['table__head'], 'Best time (seconds)');
  }
}
