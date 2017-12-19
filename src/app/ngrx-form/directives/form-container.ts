import { Input } from '@angular/core';
import { FieldDirective } from './field-directive';

export class FormContainer {
  protected formName: string;
  private fields: FieldDirective[] = [];

  public registerField(field: FieldDirective) {
    this.fields.push(field);
  }
}
