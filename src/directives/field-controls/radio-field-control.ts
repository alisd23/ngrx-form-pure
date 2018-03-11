import {  ElementRef, Injectable, OnDestroy } from '@angular/core';
import { IFieldControl, IFieldChangeCallback } from '../../types';

/**
 * Field control for a radio input
 * This service is injected into the FieldDirective conditionallity IF the
 * type of the input is 'radio'.
 * Unlike the DefaultFieldControl, the RadioFieldControl only emits when the radio
 * input it is attached to has just been selected, and it emits the value of this
 * selected input. This is because by default in this library the radio input groups
 * state value is the string value of the current selected radio input.
 * The radio inputs are grouped by the [ngrxField] value.
 */
@Injectable()
export class RadioFieldControl implements IFieldControl, OnDestroy {
  private element: HTMLInputElement;
  private fieldOnChange: IFieldChangeCallback;

  constructor(
    private elementRef: ElementRef,
  ) {}

  // Arrow function to bind context correctly
  public onChange = (e: Event) => {
    const { checked, value } = this.element;

    if (checked) {
      this.fieldOnChange(value, e)
    }
  }

  // Called from FieldDirective when the fields' state value changes
  public onValueUpdate(newValue: string) {
    this.element.checked = (newValue === this.element.value)
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
