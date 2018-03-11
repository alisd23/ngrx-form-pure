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

- [Installation](#installation)
- [Usage](#usage)
  - [Getting Started](#getting-started)
  - [Simple Form](#simple-form)
  - [Form State](#form-state)
  - [Built-in Selectors](#built-in-selectors)
  - [TypeScript](#typescript)
- [Guides](#guides)
  - [Radio Input Group](#radio-input-group)
  - [Checkbox Input Group](#checkbox-input-group)
  - [Field Validation](#field-validation)
  - [Submit Validation](#submit-validation)
  - [Resetting a Form](#resetting-a-form)
  - [Custom Form Controls](#custom-form-controls)
- [API](#api)
  - [ngrxForm](#ngrxform)
  - [ngrxField](#ngrxfield)
  - [Actions](#actions)
  - [Selectors](#selectors)
  - [Validators](#field-validators)
- [Contributing & CI](#contributing--ci)

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


### TypeScript

This library has been designed to provide as strong typings as possible, if you want that (you could always just use `any`).

There is some basic terminology used in the typings, and in these docs.

#### Form 'Shape'

This basically represents the value types for the fields in the form, for example:

```ts
interface UserFormShape {
  name: string;
  age: string;
}
```

> **Note**  
> Number inputs would still have a string value unless tranformed with the
> [elementValueTransformer](#elementvaluetransformer-value-any-element-htmlinputelement--any) or [stateValueTransformer](#statevaluetransformer-value-any-e-event--any) property inputs.

#### App 'forms state'

This is the interface for the state object under the top level `form` key - the state tree managed by `ngrx-form`. You should list all the forms you have in your app here, with the associated form state type. It's probably a good idea to use the `?` symbol for any form keys which are dynamically created/destroyed (i.e. do not always exist in your app), as the form state for these forms could be `undefined`.

Some generic interfaces in `ngrx-form` will require this type to be passed as a generic parameter, mainly to restrict which string values can be passed in as *form name* parameters

```ts
import { IFormState, IFormReducerState } from 'ngrx-form';

// Extending IFormReducerState is required to provide the strongest typings
// when passing this interface as generic parameter to (getFormActions<AppFormsState>)
interface AppFormsState extends IFormReducerState {
  newUser?: IFormState<UserFormShape>;
}
```

An example of this interface being used is when calling [`getFormActions`](#getFormActions).

```ts
import { getFormActions } from 'ngrx-form'

// Will PASS type check
const formActions = getFormActions<AppFormsState>()('newUser');
// Will FAIL type check - 'nonExistentForm' is not a valid form name
const formActions = getFormActions<AppFormsState>()('nonExistentForm');
```

> See [the  API](#getFormActions) for the reason behind needing a curried function when calling `getFormActions()(formName)`.

This type now gives us strong typings for all the functions on the `formActions` object. For example with the `changeField` action creator.

```ts
// Will PASS type check
formActions.changeField('name', 'Jo');
// Will FAIL type check, value parameter is the wrong type for name field.
formActions.changeField('name', 1);
``` 

The root form state type can then be used when defining your top level 'App state' type:

```ts
interface IAppState {
  form: AppFormsState
}
```

#### Helper types

`ngrx-form` also exposes some interfaces/types which can convert some complex types to others. These types usually take generic parameters, and converts these parameters in to other `shapes`.

##### `IFormValues<TFormState>`
Converts the state type of a form into a type representing the field names to the value type of those fields.
This type will rarely be useful, as it produces the same type as your *form shape*. It is actually the **inverse** generic type to the `IFormState` generic type.

```ts

interface UserFormShape {
  name: string;
  age: string;
}
type UserFormState = IFormState<UserFormShape>;

// UserFormValues will be the same type as UserFormShape
type UserFormValues = IFormValues<UserFormShape>;
```

##### `IFieldErrors<TFormShape, TError = string>`
Creates a type of field keys to error type (defaulting to string).
This is the return type of the [getFieldErrors](#getfielderrors) selector.

```ts
type UserFormErrors = IFieldErrors<UserFormShape>;

// Will have shape like:
// type UserFormErrors = {
//   name: string;
//   age: string;
// }
```

For other generic types, see [the source](https://github.com/alisd23/ngrx-form/tree/master/src/types)


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

Checkbox groups require a bit of custom code, but can be accomplished fairly concisely by utilising the [elementValueTransformer](#elementvaluetransformer-value-any-element-htmlinputelement--any) and [stateValueTransformer](#statevaluetransformer-value-any-e-event--any) inputs for any `ngrxField` elements.

These transformer function inputs `elementValueTransformer` and `stateValueTransformer` intercept the new value about to be set for the fields *element value* and *state value* respectively, and transform them before being set:

```
+-----------+   elementValueTransformer(stateValue)   +-----------+
|           |   -------------------------------->>    |           |
|   State   |                                         |   Input   |
|           |   <<--------------------------------    |           |
+-----------+   stateValueTransformer(inputValue)     +-----------+

```

The type of the *input value* returned from the `elementValueTransformer` passed into the `stateValueTransformer` as a parameter depend on the **type** of the input, and correspond to the default type stored in state by `ngrx-form`.
- For **regular inputs, selects, and radio buttons**, they will be the inputs value, because these form fields normally correspond to a single `string` value.
- For **checkboxes**, the type is a `boolean` - the checked status, which is what `ngrx-form` will store by default in state.

**checkbox-group-form.component.html**
```html
<form ngrxForm="myCheckboxForm">
  <input
    ngrxField="fruits"
    name="fruits"
    value="apple"
    [elementValueTransformer]="fruitElementValueTransform"
    [stateValueTransformer]="fruitStateValueTransform"
    type="checkbox"
  />
  <input
    ngrxField="fruits"
    name="fruits"
    value="orange"
    [elementValueTransformer]="fruitElementValueTransform"
    [stateValueTransformer]="fruitStateValueTransform"
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
  public fruitElementValueTransform = (fruits: string[], element: HTMLInputElement) => {
    return (
      fruits &&
      fruits.indexOf(element.value) !== -1
    );
  }

  // For checkboxes, the checked status is passed into the stateValueTransformer.
  // The return value is the value which should be stored in state. This let's us
  // aggregate the selected checkbox values in the state, as a string array of the
  // selected checkbox values (NOTE: this return value can actually be anything you want)
  public fruitStateValueTransform = (checked: boolean, e: Event): string[] => {
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

For a full description on how to use these transform functions for each input type, see the [API](#value-transformer).

---

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

To enable field field validation for some of you form fields pass down an object of field name keys to validators array to the [`fieldValidators`](#fieldvalidators--string-fieldname-ivalidator--optional) input for the `ngrxForm` directive:

Here as example of a simple user form, where the `name` field is required, and will have it's state error field populated when the value is empty.

**user-form.component.html**
```html
<form ngrxForm="userForm" [fieldValidators]="validators">
  <input ngrxField="name" />
</form>
```

**user-form.component.ts**

```ts
import { OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

interface IUserFormShape {
  name: string;
}

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html'
})
class UserForm implements OnInit {
  constructor(
    private store: Store<any>
  ) {}

  public validators = {
    name: [requiredValidator]
  }

  // Subscribe to form state changes and log the current `name` field error.
  public ngOnInit() {
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

Currently there is only one validator provided with `ngrx-form` (but happy to accept PR's with more!) - the **required validator**.

See the [API](#provided-validators) for the current list of provided validators, and their signatures.

### Submit validation

There is currently no built-in logic or form state to handle submit validation (errors, loading etc...), but this can be fairly easily implemented for the simple case.

> However if there is interest this could be implemented as a built-in solution.

Below is an example of a form component implementing a simple loading & validation flow, with just a single *submit error* to represent whether or not the request was successful.

**user-form.component.html**
```html
<form ngrxForm="userForm" (ngrxSubmit)="onSubmit($event)">
  <input ngrxField="name" />
  <input ngrxField="age" />
  <span *ngIf="error">{{error}}</span>
  <button
    type="submit"
    [disabled]="loading"
    [class.loading]="loading"
  >
    Create User
  </button>
</form>
```

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
  public loading = false;
  public error: string = null;

  public onSubmit(values: IUserFormShape) {
    this.loading = true;
    this.error = null;

    somePostRequestFunction('/new-user', values)
      .then(() => {
        this.loading = false;
      })
      .catch((error: string) => {
        this.loading = false;
        this.error = error;
      });
  }
}
```

### Resetting a form

Resetting a form requires a `RESET_FORM` action to be fired.

See the [Actions API](#actions) for information on this.

### Custom Form Controls

It is possible to create custom form controls, which can follow the same lifecycle and state changes as built-form form fields.

#### Simple example

The following example shows a simple name input component, which showcases how to initialise a custom form control correctly.

For a real working example of a custom form control, see the [demo multiselect component](https://github.com/alisd23/ngrx-form/tree/master/demo/app/genre-multiselect).

> **NOTE**  
> The `focus` and `blur` actions are not *required*, but have been included for the sake of the example.

**user-name-control.component.html**
```html
<div class="user-name">
  <input
    #input
    [value]="value"
    (focus)="onFocus()"
    (blur)="onBlur()"
    (input)="onValueChange(input.value)"
  />
<div>
```

**user-name-control.component.ts**
```ts
import { getFormActions } from 'ngrx-form';

// 'newUser' is the name of the form this component belongs to.
const userFormActions = getFormActions()('newUser');

@Component({
  selector: 'app-user-name-control',
  templateUrl: './user-name-control.component.html'
})
export class UserNameComponent implements OnInit, OnDestroy {
  // Default to something sensible whilst form/fields are initialising
  public value: string;

  constructor(private store: Store<any>) {}

  public onValueChange(newValue: string) {
    this.store.dispatch(
      userFormActions.changeField('name', newValue)
    ));
  }

  public onFocus() {
    this.store.dispatch(userFormActions.focusField('name'));
  }

  public onBlur() {
    this.store.dispatch(userFormActions.blurField('name'));
  }

  public ngOnInit() {
    delayAction(() => this.store.dispatch(
      userFormActions.registerField('name')
    ));

    // Subscribe to
    this.store
      .select('form', 'newUser', 'fields', 'name', 'value')
      // Don't want to set values whilst form is initialising, as value will be
      // undefined/null
      .filter(value => Boolean(value))
      .subscribe(values => {
        this.values = values
      });
  }

  public ngOnDestroy() {
    delayAction(() => this.store.dispatch(
      userFormActions.unregisterField('genres')
    ));
  }
}
```

**Delaying Actions**

It's important to note at this point, as you can see in the example above, that some *intialisation* actions must be **delayed** until **after** the inital change detection phase. This is due to the angular lifecycle and the fact that 'state changes' can not (or should not) occur in the middle of a change detection cycle.

This delay can be done easily with the `delayAction` function exposed by this library, which is literally just a wrapper around `setTimeout(func, 0)`.

```ts
import { delayAction, getFormActions } from 'ngrx-form';

const someFormActions = getFormActions<any>()('someForm');

delayAction(() => {
  this.store.dispatch(someFormActions.registerField('someField'));
});
```

See [this issue](https://github.com/angular/angular/issues/6005#issuecomment-165905348) for more on this.

--- 

The following list explains the actions which you can/need to dispatch when creating a custom form field control, when to dispatch them, and what their purpose is.

Given `formActions` is the object returned by calling `getFormActions()(formName)`.

##### `formActions.registerField(fieldName)`
 Creates the initial field object in `ngrx` state.
- Fire in the field components' `ngOnInit` lifecycle hook.
- Needs delaying with `delayAction`
- **Required**

##### `formActions.unregisterField(fieldName)`
Removes this field from `ngrx` state if no other fields still exist with the same field name.
- Fire in the field components' `ngOnDestroy` lifecycle hook.
- Needs delaying with `delayAction`
- **Required**

##### `formActions.changeField(fieldName, newValue)`
Updates the `value` of the field.

##### `formActions.focusField(fieldName)`
Sets the `focus` value of the field state to `true`.

##### `formActions.blurField(fieldName)`
Sets the `focus` value of the field state to `false`.

> For more details on these actions see the [actions API](#actions)

## API

### [ngrxForm]

The directive used to sync your `form` element to `@ngrx/store` state.

#### Inputs

##### `[ngrxForm]`: `string` [required]
The value for the `[ngrxForm]` directive itself. Defines the name of the key used under the root form state, in which the form state will be stored.

##### `[fieldValidators]: { [string: fieldName]: IValidator[] }` (optional)
A key-value object of field name to an array of validator functions.
See the [validation](#field-validation) section for more information.

##### `[initialValues]`: `{ [string: fieldName]: any }` (optional)
The initial values that the fields should take. These values will be set when each respective field is registered, when it is reset, and when the whole form is reset.

> **Note**
> The type for this input is actually the *shape* of the form, which depends on your form field value types. See the [TypeScript](#typescript) section for more.

#### Outputs

##### `(ngrxSubmit)`: `{ [string: fieldName]: any`
Emits a key-value object of field name to current value when the form element with the `[ngrxForm]` directive attached submits.

> **Note**
> The type for this input is actually the *shape* of the form, which depends on your form field value types. See the [TypeScript](#typescript) section for more.

You can also still listen to the raw form `submit` event if you need to, but this output is a nicer way of getting the final form values on submit.

---

### [ngrxField]

The directive used to register and sync a form field element (`input`, `select`, etc.) to the form of the nearest `[ngrxForm]` parent. 

#### Inputs

##### `[ngrxField]`: *`string`*
The value for the `[ngrxField]` directive itself. Defines the name of the key used under the form state, in which the field state will be stored.

##### `[name]`: *`string`*
Just the raw element `name` attribute. This is still applied as a regular `name` attribute to the element, but is also needed by `ngrx-form` internally.

##### `[type]`: *`string`*
Just the raw element `type` attribute. This is still applied as a regular `type` attribute on the element, but is also needed by `ngrx-form` internally.

##### `[stateValueTransformer]`: *`(value: any, e: Event) => any`*
A **state value transformer** function is called when the field's **DOM** value changes. Value returned from this function is what the field's **state** value will be set to.

The value passed in to this function depends on the `type` of the field element.
See [this section](#checkbox-input-group) for more information.

It is named as such because it is *transforming* the new *state* value for the given field, before it is set.

##### `[elementValueTransformer]`: *`(value: any, element: HTMLInputElement) => any`*
An **element value transformer** function is called when the field's **state** value changes. The value returned from this function is what the field's **DOM** value will be set to.

The return value required depends on the `type` of the field element.
See [this section](#checkbox-input-group) for more information.

It is named as such because it is *transforming* the new *state* value for the given field, before it is set.


### Dispatching Actions

##### `getFormActions<AppFormsState>()(formName: string): IFormActions`
A curried function which returns an object of **action creators** which return `action` objects. The actions available on this object are listed below.

Actions can then be dispatched like so:

```ts
const formActions = getFormActions()('userForm');
store.dispatch(formActions.initForm());
```

The `AppFormsState` generic parameter is the type of the state tree under the top level `form` key, managed by `ngrx-form`. See the [TypeScript section](#typescript) for more on this.


> **NOTE**  
> The reason for having a curried function here is because TypeScript does not yet support a subset of generic parameters to be optional. It's all or nothing. To provide the strongest typings possible a workaround is necessary.
> See this issue for more details: https://github.com/Microsoft/TypeScript/issues/16597


### Action Creators

The following is an exhaustive list of all the `ngrx-form` action creators of which the return value can be dispatched. Usually this will only need to be done in [custom components](#custom-components), and some of these actions you should *never™* need to dispatch,
 but they are documented just in case.


The following action creators assume the `getFormActions` function above has been called and the resulting object is stored in some `formActions` variable.

##### `formActions.initForm()`
When dispatched, a new form will be created in the root forms state, initialised with empty values. The new form state will be under the key name specified in the initial `getFormActions` call.

##### `formActions.resetForm()`
When dispatched, the form will reset back to the default state, resetting any field values back to their initial values, if they were set at some point via the `setInitialValues` action. 

##### `formActions.destroyForm()`
When dispatched, the form state will be destroyed, and the form state object completely removed from the root form state object. 

##### `formActions.focusField(fieldName: string)`
When dispatched, the field defined by the `fieldName` parameter will have its `focus` state set to `true`.

##### `formActions.blurField(fieldName: string)`
When dispatched, the field defined by the `fieldName` parameter will have its `focus` state set to `false`.

Also the field's `touched` property is set to `false` as the field has now been focused and unfocused at least once.

##### `formActions.changeField(fieldName: string, value: any)`
When dispatched, the field defined by the `fieldName` parameter will have its `value` state updated to that provided by the `value` parameter.

> **Note**  
> Although the parameters are weakly typed here, if you are using typescript as described in the [TypeScript](#typescript) section, there are stronger guarentees.
The field must be one of the keys in the form shape.
The value must be the correct value of that field as defined in the form shape type.

##### `formActions.updateFieldErrors(errors: { [fieldName: string]: any})`
Sets the errors for **all** the fields in the form. The `errors` parameter is an object of field names to error messages/values. If a field is not present in the object, it's error will be set to `undefined`, effectively *unsetting* the error.

##### `formActions.registerField(fieldName: string)`
Registers a field in the form. If this is the first time a field with this name has been registered, a new object is set in the form controls state, under the `fieldName` key. If it is not the first field of this name being registered, only the `count` of that field is updated in state.

This action creator will be useful when creating [custom form controls](#custom-form-controls).

##### `formActions.unregisterField(fieldName: string)`
Unregisters a field in the form. If there is only one field registered with that name, the field's state will be removed from the form controls state entirely. If there are still registered fields left with the same name, the `count` state property is decremented by 1.

This action creator will be useful when creating [custom form controls](#custom-form-controls).

##### `formActions.setInitialValues(values: { [fieldName: string]: any })`
Sets any initial values for the fields in the form. These are the values which will be set in the field's state when the form if the form resets (and also after this action is dispatched).

The *type* of the `values` parameter is more strongly typed as the *form shape*. (See the [TypeScript](#typescript) section).


---

### Selectors
Selectors are simply functions which convert part of the form state into a different format. Some common selectors are provided by `ngrx-form`.

The current set of built-in selectors are as follows.

##### `getFormValues(formState: IFormState<any>): IFormValues<any>`
Returns an object of field name keys to field values.

##### `getFormErrors(formState: IFormState<any>): IFormErrors<any>`
Returns an object of field name keys to field errors.

##### `isFormPristine(formState: IFormState<any>): boolean`
Returns a boolean flag signalling whether or not the form is **pristine**.

A form is pristine if all the field values are the same as their *initial values*, if there are any `initialValues` defined.

If there are no `initialValues` defined in state, this selector returns `false`.

> **Note**
> For these selectors, if using typings as described in the [TypeScript](#typescript) section, the `any` generics in the method signatures above will instead be strongly typed to the *shape* of the form.

---

### Field Validators
The following set is the set of built-in field validators provided by `ngrx-form`.

See the [field validation](#field-validation) section for an example of using field validation.

##### `required(fieldName: string): IFieldValidator<any, any>`
The validator returned by the `required` function resolves to an error in the format: `"${fieldName} is required"` when the value of the field is *falsy*.


## Contributing & CI

`ngrx-form` uses the following services/technologies for the CI and testing:
- [Travis CI](https://travis-ci.org/) for the CI, which runs unit and integration tests.
- [Cypress](https://www.cypress.io/) for the integration tests (which run on Travis). Past integration test runs (including recordings of the tests) can be seen on the [Cypress ngrx-form dashboard](https://dashboard.cypress.io/#/projects/rep3hw/runs).
- Karma & Jasmine for unit tests.
