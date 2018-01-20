import {  ElementRef, Injectable, OnDestroy } from '@angular/core';
import { IFieldControl, IFieldInfo } from '../../types';

@Injectable()
export class CheckboxFieldControl implements IFieldControl, OnDestroy {
  private element: HTMLInputElement;
  private fieldInfo: IFieldInfo;

  constructor(
    private elementRef: ElementRef,
  ) {}

  // Arrow function to bind context correctly
  onChange = (e: Event) => {
    const { checked } = this.element;
    this.fieldInfo.onChange(checked, e);
  }

  onValueUpdate(newValue: boolean) {
    this.element.checked = newValue;
  }

  initialise(fieldInfo: IFieldInfo) {
    this.fieldInfo = fieldInfo;
    this.element = this.elementRef.nativeElement;
    this.element.addEventListener('change', this.onChange);
  }

  ngOnDestroy() {
    this.element.removeEventListener('change', this.onChange);
  }
}
