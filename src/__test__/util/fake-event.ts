export function createFakeEvent(eventName: string, params: EventInit = {}) {
  if ((window as any).CustomEvent === 'function') {
    return new CustomEvent(eventName, params);
  }
  params.bubbles = params.bubbles === undefined ? false : params.bubbles;
  params.cancelable = params.cancelable === undefined ? false : params.cancelable;

  const event = document.createEvent( 'CustomEvent' );
  event.initCustomEvent(eventName, params.bubbles, params.cancelable, undefined);
  return event;
}
