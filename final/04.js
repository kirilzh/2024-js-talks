/**
 * Observer
 */
function identity(...args) {
  return args;
}

function createSimpleObserver() {
  let subscribers = [];

  function subscribe(onNext = identity, onError = identity, onComplete = identity) {
    const subscriber = {
      next: onNext,
      error: onError,
      complete: onComplete
    };

    subscribers.push(subscriber);

    return () => {
      subscribers = subscribers.filter((s) => Object.is(s, subscriber));
    };
  }

  function next(value) {
    subscribers.forEach((sub) => sub.next(value));
  }

  function error(err) {
    subscribers.forEach((sub) => sub.error(err));
  }

  function complete() {
    subscribers.forEach((sub) => sub.complete());
  }

  return { subscribe, next, error, complete };
}

function createState(initialState, reducer) {
  let state = initialState;
  const observable = createSimpleObserver();

  function dispatch(action) {
    state = reducer(state, action);
    observable.next(state);
  }

  function subscribe(onNext, onError, onComplete) {
    const unsubscribe = observable.subscribe(onNext, onError, onComplete);
    onNext(state);
    return unsubscribe;
  }

  function complete() {
    observable.complete();
  }

  function getState() {
    return state;
  }

  return { subscribe, dispatch, getState, complete };
}

function reducer(state, action) {
  if (action.type === 'change') {
    return { value: action.payload.value };
  }
  return state;
}

const stateManager = createState({ value: 'Hello' }, reducer);

// Create DOM elements
const node = document.createTextNode(stateManager.getState().value);
const paragraph = document.createElement('p');
paragraph.appendChild(node);
document.body.appendChild(paragraph);

stateManager.subscribe(
  (state) => {
    node.textContent = state.value;
    console.log('State updated:', state);
  },
  (error) => console.error('Error:', error),
  () => console.log('Observable completed')
);

stateManager.dispatch({ type: 'change', payload: { value: 'Hello JS.Conf!' } });
stateManager.complete();

// ============================================================================
