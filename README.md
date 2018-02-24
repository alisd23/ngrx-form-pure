# ngrx-form

Ngrx-form is a library for storing your form state in the global state container provided by `@ngrx/store`.

The form state for any forms you hook up will be available under the `form` key of the `@ngrx/store` state object.

This library has currently only been tested with `@ngrx/store` version **5.x**

## Installation

#### npm
```
npm install ngrx-form --save
```

#### yarn
```
yarn add ngrx-form --save
```

#### Peer Depdendencies
Ngrx-form has the following peer dependencies which you must install in order
to use this library:
- `@angular/core`
- `@ngrx/store`

## Usage

### Getting Started

### Simple Form
(Form directive)
(Couple of fields)
(Submit)

### Form State
(full state object)
(Selecting form state)

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


## Typescript
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
