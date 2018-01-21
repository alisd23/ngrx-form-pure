import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ITestAction } from '../util/types';

import 'rxjs/add/operator/pluck';

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
    this.state$ = state$ || subject$.asObservable();
  }

  /**
   * Pass the underlying subject through to allow for manually push actions
   * down to fake an action
   */
  select(...keys: any[]) {
    return new StoreMock(this.subject$, this.state$.pluck(...keys));
  }

  dispatch(action: ITestAction) {}

  subscribe(...args): Subscription {
    return this.state$.subscribe(...args);
  }
}
