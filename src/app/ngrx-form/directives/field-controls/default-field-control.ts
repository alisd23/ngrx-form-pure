import {  ElementRef, Injectable, OnDestroy } from '@angular/core';
import { IFieldControl, IFieldInfo } from '../../types';

@Injectable()
export class DefaultFieldControl implements IFieldControl, OnDestroy {
  private element: HTMLInputElement;
  private fieldInfo: IFieldInfo;

  constructor(
    private elementRef: ElementRef,
  ) {}

  // Arrow function to bind context correctly
  onChange = (e: Event) => {
    this.fieldInfo.onChange(this.element.value, e);
  }
  
  onValueUpdate(newValue: string) {
    this.element.value = newValue;
  }

  initialise(fieldInfo: IFieldInfo) {
    this.fieldInfo = fieldInfo;
    this.element = this.elementRef.nativeElement;
    this.element.addEventListener('input', this.onChange);
  }

  ngOnDestroy() {
    this.element.removeEventListener('input', this.onChange);
  }
}