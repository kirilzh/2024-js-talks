/**
 * 03 Reactive
 */
import { stateManager } from './02';

function domManager(appState) {
  const node = document.createTextNode('');
  const paragraph = document.createElement('p');
  paragraph.appendChild(node);
  document.body.appendChild(paragraph);

  function updateDOM(state) {
    node.textContent = state.value;
    console.log('DOMUpdater: Updated DOM with state:', state);
  }

  appState.onStateChange(updateDOM); // reacting to changes in appState
}

const appState = stateManager({ value: 'Hello' }, reducer);
domManager(appState);

// No need to set up the subscription here anymore
// The domManager handles its own subscription internally

appState.dispatch({ type: 'change', payload: { value: 'Hello JS.Conf' } });

// ============================================================================
