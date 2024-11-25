/**
 * 02 Controlled example
 */

export function stateManager(initialState, reducer) {
  console.log('[CREATED STATE MANAGER]');
  let state = initialState;
  const stateWatchers = [];

  function dispatch(action) {
    console.log('[EMITTED]', action);
    const newState = reducer(state, action);
    if (state.value !== newState.value) {
      state = newState;
      stateWatchers.forEach((w) => w(state));
    }
  }

  function onStateChange(watcher) {
    console.log('[CREATED A RELATIONSHIP]');
    stateWatchers.push(watcher);
    // Immediately notify
    watcher(state);
  }

  function getState() {
    return state;
  }

  return { dispatch, onStateChange, getState };
}

function domManager() {
  console.log('[CREATED DOM MANAGER]');

  const node = document.createTextNode('');
  const paragraph = document.createElement('p');
  paragraph.appendChild(node);
  document.body.appendChild(paragraph);

  function updateDOM(state) {
    node.textContent = state.value;
    console.log('DOMUpdater: Updated DOM with state:', state);
  }

  return { updateDOM };
}

function reducer(state, action) {
  if (action.type === 'change') {
    return { value: action.payload.value };
  }
  return state;
}

const appState = stateManager({ value: 'Hello' }, reducer);
const domUpdater = domManager();

// appState -> domUpdater
appState.onStateChange((state) => {
  console.log('[REACTED TO]', state);
  domUpdater.updateDOM(state);
});

// Dispatch an action to change the state
appState.dispatch({ type: 'change', payload: { value: 'Hello JS.Conf' } });

// ============================================================================
