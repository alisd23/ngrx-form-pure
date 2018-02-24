import { ComponentFixture } from '@angular/core/testing';

/**
 * For form/field initialise actions, as they all execute after the initial change
 * detection cycle has completed - we need to skip to the next event loop
 * so all waiting timers (with 0 timeout) will have executed, and therefore the
 * actions will have fired.
 *
 */
export function detectFormLifecycleActions(fixture: ComponentFixture<any>) {
  jasmine.clock().install();
  fixture.detectChanges();
  jasmine.clock().tick(0);
  jasmine.clock().uninstall();
}
