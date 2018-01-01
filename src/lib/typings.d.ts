// You can add project typings here.

declare module 'immer' {
  export default function<S = any>(
    currentState: S,
    thunk: (draftState: S) => void,
  ): S
}