import {  ElementRef, Injectable, OnDestroy } from '@angular/core';
import { IFieldControl, IFieldChangeCallback } from '../../types';

/**
 * Field control for a checkbox input
 * This service is injected into the FieldDirective conditionallity IF the
 * type of the input is 'checkbox'.
 * Unlike the DefaultFieldControl, the CheckboxFieldControl emits the 'checked'
 * attribute on change instead of the value. This means by default, a checkbox input
 * has a 'boolean' value as its state value.
 */
@Injectable()
export class CheckboxFieldControl implements IFieldControl, OnDestroy {
  private element: HTMLInputElement;
  private fieldOnChange: IFieldChangeCallback;

  constructor(
    private elementRef: ElementRef,
  ) {}

  // Arrow function to bind context correctly
  public onChange = (e: Event) => {
    const { checked } = this.element;
    this.fieldOnChange(checked, e);
  }

  // Called from FieldDirective when the fields' state value changes
  public onValueUpdate(newValue: boolean) {
    this.element.checked = newValue;
  }

  // Called from FieldDirective when the field intialises (after ngOnInit)
  public initialise(fieldChangeCallback: IFieldChangeCallback) {
    this.fieldOnChange = fieldChangeCallback;
    this.element = this.elementRef.nativeElement;
    this.element.addEventListener('change', this.onChange);
  }

  public ngOnDestroy() {
    this.element.removeEventListener('change', this.onChange);
  }
}
