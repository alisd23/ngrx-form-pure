# ngrx-form

Ngrx-form is a library for storing your form state in the global state container provided by `@ngrx/store`.

This library has currently only been tested with `@ngrx/store` version **5.x** but may work with others.

> #### Disclaimer
> Even if you are using `ngrx-form` in your app, it doesn't necessarily mean you *need*
> this library. Only use this library if you definitely want your form state to be globally
> available in the `ngrx/store` global state container, and/or require the benefits of
> `ngrx/store` for forms.
>
> I would recommend considering `@angular/forms` before deciding on this library, as
> it may be all you need (and is probably richer in functionality).


## Installation

#### npm
```
npm install ngrx-form --save
```

#### yarn
```
yarn add ngrx-form
```  
#### Peer Dependencies
 Ngrx-form has the following peer dependencies which you must install in order
 to use this library:
- `@angular/core - v5.x`
- `@ngrx/store - v5.x`

## Usage

### Getting Started

Firstly, we need to register the `ngrx-form` module, which will automatically register
the `ngrx-form` reducer under the `form` key at the top level of your `ngrx` state.

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgrxFormModule } from 'ngrx-form';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot(yourReducers),
    NgrxFormModule // <== Import form module here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Simple Form

`ngrx-form` uses directives to manage the communication and state changes required to sync the form state with the form fields.

There are 2 directives:
- `ngrxForm` - which you attach to your form element, ...
- `ngrxField` - which you attach to the form fields/inputs in your form

(Form directive)
(Couple of fields)
(Submit)


### Form State

The state of any forms hooked up to `ngrx-form` will be stored in your global state object
like so:

```typescript
// Example form shape:
interface RootState {
  form: {
    // See below for shape of individual forms' state
    userForm: IUserFormState,
    someOtherForm: IFormState<any>
  }
}
```

Where the user form state could have a structure like the following:

```ts
interface IFormFieldState<ValueType, ErrorType> {
  error?: ErrorType;
  focus: boolean;
  value: ValueType;
  count: number;
  touched: boolean;
}

// State shape for an individual form
interface IUserFormState {
  name: string;
  initialValues?: {
    name?: string;
    age?: string;
  };
  fields: {
    // NOTE: fields are optional here as fields can be dynamically added and
    // removed from the form.
    name?: IFormFieldState<string, string>;
    age?: IFormFieldState<string, string>;
  };
  invalid: boolean;
}
```

For a clear example of what the state for a form looks like in reality check out the [demo](https://ngrx-form-demo.alisd.io).

Interfaces for state are provided by the library to give you strong typing (or the
option for strong typing) in your state object.

See the [TypeScript](#typescript) section for more information on this.


### Built-in Selectors
(getFormValues)
(getFormErrors)
(isFormPristine)


## Guides

### Radio/Checkbox Groups
(Checkbox group example)
(Radio group example)
- Both using valueMutator/stateMutator

### Field validation
(Built-in validators)
(Custom validator - IValidator)

### Submit validation
(No built-in state support)
(Example showing onSubmit handler)

### Resetting form
(Reset form action)

### Custom Form Controls
(Action flow - initField, changeField, focusField etc...)
Link to


## Dispatching Form Actions
(Info on timings and order of form actions)
Explain all form initialise phase actions must be delayed until AFTER the initial
round of change detection, as to not cause updates within a change detection phase.
- https://github.com/angular/angular/issues/6005#issuecomment-165905348
-

Order of actions in initialisation phase:
- Form register (inside form ngOnInit)
- Field register (inside field ngOnInit)
- Set initial field values (inside form ngAfterContentInit)


## TypeScript
(Root Forms state)
(Form Shape) => (Form State)


## API

### ngrxForm
(Inputs)
(Outputs)

### ngrxField
(Inputs)
(Outputs)

### Form Store Actions
(List of actions - parameters, return types)
