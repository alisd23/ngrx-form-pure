import { OnDestroy } from '@angular/core';

export type IFieldChangeCallback = (newValue: any, e: Event) => void;

export interface IFieldControl {
  onChange(e: Event): any;
  onValueUpdate(newValue: any): void;
  initialise(onChange: IFieldChangeCallback): void;
}
