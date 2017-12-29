import { OnDestroy } from '@angular/core';

export interface IFieldInfo {
  fieldName: string;
  formName: string;
  onChange(newValue: any, e: Event): void;
}

export interface IFieldControl extends OnDestroy {
  onChange(e: Event): any;
  onValueUpdate(newValue: any): void;
  initialise(fieldInfo: IFieldInfo);
}
