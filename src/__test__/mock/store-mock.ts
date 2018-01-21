import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { TestAction } from '../util/types';

import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/do';

export class StoreMock {
  // Underlying subject, used for mocking state updates
  subject$: BehaviorSubject<any>;
  // Observable representing state. Added to make select() work correctly in tests
  state$: Observable<any>;

  constructor(
    subject$ = new BehaviorSubject({}),
    state$?: Observable<any>
  ) {
    this.subject$ = subject$;
    this.state$ = state$ || subject$.asObservable().do(console.log);
  }

  /**
   * Pass the underlying subject through to allow for manually push actions
   * down to fake an action
   */
  select(...keys: any[]) {
    return new StoreMock(this.subject$, this.state$.pluck(...keys));
  }

  dispatch(action: TestAction) {}

  subscribe(...args): Subscription {
    return this.state$.subscribe(...args);
  }
}
