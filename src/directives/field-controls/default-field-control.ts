import {  ElementRef, Injectable, OnDestroy } from '@angular/core';
import { IFieldControl, IFieldChangeCallback } from '../../types';

/**
 * Field control for a regular input, or any input not handled by one of the specific
 * field controls (e.g. checkbox, radio).
 * Its job is to handle what the next 'state' value for the field should be, by calling
 * the onChange(newValue) callback passed in via 'initialise' method, which is called by the
 * FIeldDirective itself.
 */
@Injectable()
export class DefaultFieldControl implements IFieldControl, OnDestroy {
  private element: HTMLInputElement;
  private fieldOnChange: IFieldChangeCallback;

  constructor(
    private elementRef: ElementRef,
  ) {}

  // Arrow function to bind context correctly
  public onChange = (e: Event) => {
    this.fieldOnChange(this.element.value, e);
  }

  // Called from FieldDirective when the fields' state value changes
  public onValueUpdate(newValue: string) {
    this.element.value = newValue || '';
  }

  // Called from FieldDirective when the field intialises (after ngOnInit)
  public initialise(fieldChangeCallback: IFieldChangeCallback) {
    this.fieldOnChange = fieldChangeCallback;
    this.element = this.elementRef.nativeElement;
    this.element.addEventListener('input', this.onChange);
  }

  public ngOnDestroy() {
    this.element.removeEventListener('input', this.onChange);
  }
}
