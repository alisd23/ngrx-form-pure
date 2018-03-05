/**
 * Simple wrapper of setTimeout 0.
 * This is required because Actions in the initialisation (onInit, afterViewInit, ...)
 * phase must be delayed until after this has completed.
 * This is because in Angular you are not supposed to trigger changes whilst in a
 * change detection phase (the initialisation phase is the first change detection phase
 * for a component tree). See README.md for more information.
 * and https://github.com/angular/angular/issues/17572#issuecomment-364175055
 */
export function delayAction(func: Function) {
  setTimeout(func, 0);
};
