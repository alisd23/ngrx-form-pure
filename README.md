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

---

### Simple Form

`ngrx-form` uses directives to manage the communication and state changes required to sync the form state with the form fields.

There are only **two** directives in `ngrx-form`:
- `ngrxForm` - to attach to your form element.
- `ngrxField` - to attach to your form fields/inputs.

Together they handle the changes to the form state, creation and removal of the form and fields.

The following is a very simple example of a form with just two text inputs.

**user-form.component.html**
```html
<form ngrxForm="userForm" (ngrxSubmit)="onSubmit($event)">
  <input ngrxField="name" />
  <input ngrxField="age" type="number" />
</form>
```

The `ngrx-form` directives in the template above will automatically create the form and both fields fields in the `@ngrx/store` state, and any changes to the fields state (e.g. value, focus) will be kept in sync with that state. See the next section for a more detailed look at the shape of the state for a form.

The `(ngrxSubmit)` output emits an object of field names to values when the form is submitted.

**user-form.component.ts**

```ts
import { Store } from '@ngrx/store';

interface IUserFormShape {
  name: string;
  age: string;
}

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html'
})
class UserForm {
  public onSubmit(values: IUserFormShape) {
    console.log('Submitted values: ', values);
  }
}
```

---

### Form State

The state of any forms hooked up to `ngrx-form` will be stored in your global state tree in the following way:

```ts
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

For a clear example of what the state shape for a form looks like in reality - check out the [demo](https://ngrx-form-demo.alisd.io).

Interfaces for state types are provided by this library to give you strong typing (or the option for strong typing) in your state tree and form actions, and to make defining types like the `IUserFormState` interface much simpler.

###### See the [TypeScript](#typescript) section for more information on this.


### Built-in Selectors

State **selectors** are functions which transform the raw state into a different, more useful format. These functions can be used in conjunction with the RxJS `map` operator on the state stream returned by `Store.select()`, or just called directly with some state object.

`ngrx-form` comes with a few built-in selectors as a starting point which can be used to transform form state into different formats.

For example, grabbing the current field values out of the form state using the built-in `getFormValues` selector:

```ts
import { getFormValues } from 'ngrx-form';

interface IUserFormShape {
  name: string;
  age: string;
}

// userFormValues$ will be a stream of the current values for the fields in the user form.
const userFormValues$: Observable<IUserFormShape> = store
  .select('form', 'userForm')
  .map(getFormValues);
```

###### See the [selectors API](#state-selectors) for a list of all the available built-in selectors.


## Guides

The following guides have been created with the goal to keep them as simple and isolated as possible, for the functional area in which the guide is targetting. This means there is a lot of loose typing (`any`'s everywhere...).

This is purely because the typings for the form state can be quite complex so for the purpose of keeping the example code small I have ommitted many typings.

A full guide to achieving strong typing with this library can be found in the [TypeScript]('typescript') section.

Or check out the [demo code](https://github.com/alisd23/ngrx-form/tree/master/demo) to see an example of strong typings with `ngrx-form`.

### Radio Input Group

Radio input groups work out of the box with `ngrx-form`. Radio inputs with the same `ngrxField` name (and `name`) will be treated as part of the same *group*, therefore creating only one key in the form `fields` state, which all the inputs of the group share.

The value of the radio group field in state will be the `value` of the currently selected radio input.

**radio-group-form.component.html**
```html
<form ngrxForm="myRadioForm">
  <input
    ngrxField="yesOrNo"
    name="yesOrNo"
    type="radio"
    value="yes"
  />
  <input
    ngrxField="yesOrNo"
    name="yesOrNo"
    type="radio"
    value="no"
  />
</form>
```

You'll notice both the `ngrxField` directive and `name` attribute have been set here.
- The `name` attribute is what the browser uses to link radio buttons into a group, and provides the default mutual exclusivity behaviour of radio inputs.
- The `ngrxField` directive actually handles this same behaviour independently of the name attribute, along with all the state updates.

> **NOTE**  
> Although technically only the `ngrxField` directive is required on the radio inputs, the `name` attribute probably has some effect on accessibility in browsers, therefore I would still recommend setting the `name` attribute as I have done here.


### Checkbox Input Group

Checkbox groups require a bit of custom code, but can be accomplished fairly concisely by utilising the [valueTransformer](#value-transformer) and [stateTransformer](#state-transformer) `fieldDirective` inputs.

These *transformer* function inputs `valueTransformer` and `stateTransformer` transform the fields 'input value' and 'state value' respectively, **before** being set.

The type of the 'input value' returned from the `valueTransformer` passed into the `stateTransformer` as a parameter depend on the **type** of the input, and correspond to the default type stored in state by `ngrx-form`.
- For **regular inputs, selects, and radio buttons**, they will be the inputs value, because these form fields normally correspond to a single `string` value.
- For **checkboxes**, the type is a `boolean` - the checked status, which is what `ngrx-form` will store by default in state.

For a full description on how to use these transform functions for each input type, see the [API](#value-transformer).

**checkbox-group-form.component.html**
```html
<form ngrxForm="myCheckboxForm">
  <input
    ngrxField="fruits"
    name="fruits"
    value="apple"
    [valueTransformer]="fruitValueTransform"
    [stateTransformer]="fruitStateTransform"
    type="checkbox"
  />
  <input
    ngrxField="fruits"
    name="fruits"
    value="orange"
    [valueTransformer]="fruitValueTransform"
    [stateTransformer]="fruitStateTransform"
    type="checkbox"
  />
</form>
```

**checkbox-group-form.component.ts**
```ts
import { Store } from '@ngrx/store';

@Component({
  selector: 'checkbox-group-form',
  templateUrl: './checkbox-group-form.component.html'
})
class CheckboxGroupForm {
  private formState: IFormState<any>;

  constructor(
    private store: Store<any>
  ) {
    this.store
      .select('form', 'myCheckboxForm')
      .subscribe(formState => this.formState = formState);
  }

  // Return whether or not the checkbox should be checked. Ngrx-form will then set
  // the inputs checked value appropriately.
  public fruitValueTransform = (fruits: string[], element: HTMLInputElement) => {
    return (
      fruits &&
      fruits.indexOf(element.value) !== -1
    );
  }

  // For checkboxes, the checked status is passed into the stateTransformer.
  // The return value is the value which should be stored in state. This let's us
  // aggregate the selected checkbox values in the state, as a string array.
  // NOTE: this return value can actually be anything you want
  public fruitStateTransform = (checked: boolean, e: Event): string[] => {
    const currentState = this.formState.fields.fruits.value;
    const newState = new Set(currentState);
    const fruitName = (e.target as HTMLInputElement).value;

    if (checked) {
      newState.add(fruitName);
    } else {
      newState.delete(fruitName);
    }

    return Array.from(newState);
  }
}
```

See the demo for full examples of both radio button groups and checkbox groups [on GitHub](https://github.com/alisd23/ngrx-form/tree/master/demo/app/user-form).
> See the demo running [here](https://ngrx-form-demo.alisd.io)

### Field validation

`Ngrx-form` provides a simple API for field-level validation. You are able to associate each field with an array of **validators**, which `ngrx-form` will call in the order that they appear in the array, until the first *truthy* value is returned form a validator. This value will then be set in the `error` property in the state for that field.

A validator has the following shape:

```ts
type IFieldValidator<FormShape, V> =
  (value: V, form: IFormState<FormShape>) => string | undefined

// 'Shape' of the form (fields and their types)
interface IUserFormShape {
  name: string;
}

// Simple "required" validator
function requiredValidator(value: string) {
  return value ? undefined : 'Field is required';
}
```

`Ngrx-form` will call these validators, passing in the current value of the field from state and the current state of the form the field belongs to. This should cover most cases for validators.

To enable field field validation for some of you form fields pass down an object of field name keys to validators array to the [`fieldValidators`](#ngrxForm) input for the `ngrxForm` directive:

Here as example of a simple user form, where the `name` field is required, and will have it's state error field populated when the value is empty.

**user-form.component.html**
```html
<form ngrxForm="userForm" [fieldValidators]="validators">
  <input ngrxField="name" />
</form>
```

**user-form.component.ts**

```ts
import { Store } from '@ngrx/store';

interface IUserFormShape {
  name: string;
}

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html'
})
class UserForm {
  constructor(
    private store: Store<any>
  ) {}

  public validators = {
    name: [requiredValidator]
  }

  // Subscribe to form state changes and log the current `name` field error.
  ngOnInit() {
    this.store
      .select('form', 'userForm')
      .subscribe(formState => {
        console.log('Name error: ', formState.fields.name.error);
      });
  }
}
```

Check out the [demo](https://ngrx-form-demo.alisd.io) to see an example of validators in action.

##### Provided validators

Currently there is only one validator provided from `ngrx-form` (but happy to accept PR's with more!) - the required validator.

See the [API](#provided-validators) for the current list of provided validators, and their signatures.

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

#### Inputs

##### `fieldValidators: { [string: fieldName]: IValidator[] }`

#### Outputs

---

### ngrxField

#### Inputs

##### `valueTransformer(transformFunc: Function)`

#### Outputs

---

### Form Store Actions
(List of actions - parameters, return types)

---

### State Selectors
(getFormValues)
(getFormErrors)
(isFormPristine)

### Provided Validators


## Contributing & CI

`ngrx-form` uses the following services/technologies for the CI and testing:
- [Travis CI](https://travis-ci.org/) for the CI, which runs unit and integration tests.
- [Cypress](https://www.cypress.io/) for the integration tests (which run on Travis). Past integration test runs (including recordings of the tests) can be seen on the [Cypress ngrx-form dashboard](https://dashboard.cypress.io/#/projects/rep3hw/runs).
- Karma & Jasmine for unit tests.
