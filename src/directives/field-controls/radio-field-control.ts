import {  ElementRef, Injectable, OnDestroy } from '@angular/core';
import { IFieldControl, IFieldInfo } from '../../types';

@Injectable()
export class RadioFieldControl implements IFieldControl, OnDestroy {
  private element: HTMLInputElement;
  private fieldInfo: IFieldInfo;

  constructor(
    private elementRef: ElementRef,
  ) {}

  // Arrow function to bind context correctly
  onChange = (e: Event) => {
    const { checked, value } = this.element;

    if (checked) {
      this.fieldInfo.onChange(value, e)
    }
  }

  onValueUpdate(newValue: string) {
    this.element.checked = (newValue === this.element.value)
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
