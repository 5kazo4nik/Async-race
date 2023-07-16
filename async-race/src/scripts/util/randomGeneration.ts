import { CARMODELS, CARNAMES, COLORNUMS } from '../data/randomValues';
import { CarData } from '../types/dataTypes';

export type RandomCarsData = Pick<CarData, 'name' | 'color'>;

export class RandomGenerator {
  public static generateName(): string {
    const nameIndex = Math.round(Math.random() * (CARNAMES.length - 1));
    const modelIndex = Math.round(Math.random() * (CARMODELS.length - 1));
    const name = CARNAMES[nameIndex];
    const model = CARMODELS[modelIndex];
    return `${name} ${model}`;
  }

  public static generateColor(): string {
    let color = '#';

    for (let i = 0; i < 6; i += 1) {
      const index = Math.round(Math.random() * (COLORNUMS.length - 1));
      const value = COLORNUMS[index];
      color += value;
    }
    return color;
  }

  public static generateCarsData(): RandomCarsData[] {
    const dataArr: RandomCarsData[] = [];

    for (let i = 0; i < 100; i += 1) {
      const name = RandomGenerator.generateName();
      const color = RandomGenerator.generateColor();
      dataArr.push({ name, color });
    }

    return dataArr;
  }
}
