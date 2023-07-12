import { EventEmitter } from '../emitter/emitter';

/* eslint-disable max-len */
export abstract class Creator {
  constructor(protected readonly emitter: EventEmitter) {}

  public static renderElem(parent: HTMLElement, tag: string, classes?: string[], text?: string | null, type?: string): HTMLElement {
    const elem = document.createElement(tag);
    if (classes) elem.classList.add(...classes);
    if (text) elem.textContent = text;
    if (type && elem instanceof HTMLInputElement) elem.type = type;
    parent.append(elem);
    return elem;
  }
}
