import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ITestAction } from '../util/types';

import 'rxjs/add/operator/pluck';

export class StoreMock extends BehaviorSubject<any> {
  select(...keys: any[]) {
    const newMock = new StoreMock(this.value);
    this
      .pluck(...keys)
      .subscribe(value => newMock.next(value));
    return newMock;
  }

  dispatch(action: ITestAction) {}
}
