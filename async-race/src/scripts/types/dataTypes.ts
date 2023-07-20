export type CarData = {
  readonly id: number;
  readonly name: string;
  readonly color: string;
};

export type ResultData = {
  id: number;
  wins: number;
  time: number;
};

export type EngineData = {
  id: number;
  flag: HTMLElement;
  car: HTMLElement;
  name: string;
  readonly velocity: number;
  readonly distance: number;
};

export type WinResults = {
  id: number;
  time: number;
  name: string;
};
