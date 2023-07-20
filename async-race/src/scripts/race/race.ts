import { ApiQuery } from '../api/apiQuery';
import { EventEmitter } from '../emitter/emitter';
import { EngineData } from '../types/dataTypes';

/* eslint-disable no-param-reassign */
export class Race {
  private static subscribers: Map<number, number> = new Map();
  public static isRace = false;
  public static isWin = false;

  public static start(data: EngineData, emitter: EventEmitter): void {
    // eslint-disable-next-line object-curly-newline
    const { id, car, flag, name } = data;

    const carRect = data.car.getBoundingClientRect();
    const flagRect = flag.getBoundingClientRect();
    const startPos = carRect.left;
    const endPos = flagRect.left + 15;

    const diff = endPos - startPos;
    const duration = data.distance / data.velocity;
    const startTime = performance.now();

    function step(timestamp: number): void {
      const curTime = timestamp - startTime;
      const nextPos = startPos + (diff * curTime) / duration;

      car.style.left = `${nextPos}px`;

      if (curTime < duration) {
        const animationId = requestAnimationFrame(step);
        Race.subscribers.set(id, animationId);
      } else if (Race.isRace && !Race.isWin) {
        Race.isWin = true;
        const endTime = performance.now();
        const raceTime = parseFloat(((endTime - startTime) / 1000).toFixed(2));
        emitter.emit('winRace', { id, time: raceTime, name });
      }
    }

    ApiQuery.engine(id, 'drive').catch(() => Race.stop(id));
    const animationId = requestAnimationFrame(step);
    Race.subscribers.set(id, animationId);
  }

  public static reset(car: HTMLElement, startPos: number): void {
    car.style.left = `${startPos}px`;
  }

  public static stop(carId: number): void {
    const animationId = this.subscribers.get(carId);
    if (animationId) cancelAnimationFrame(animationId);
  }
}
