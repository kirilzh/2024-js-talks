const initialState = {
  // the radius of the large circle
  R: 15,
  // the radius of the small circle
  r: 8,
  // distance from the center of the smaller circle
  d: 12
};

const eventBus = eventBusFactory();

window.onload = () => {
  setRootCssProperty('--R', initialState.R);
  setRootCssProperty('--r', initialState.r);
  setRootCssProperty('--d', initialState.d);

  setInterval(() => {
    setRootCssProperty('--R', initialState.R++);
    setRootCssProperty('--r', initialState.r++);
    setRootCssProperty('--d', initialState.d++);
  }, 1000)


  eventBus.on('UPDATED_PROPERTY', ({ property, value }) => {
    setRootCssProperty(property, value);
  });

  document.querySelectorAll('[data-locator]').forEach((node) => {
    const locator = node.dataset.locator;
    node.addEventListener('click', () => {
      setRootCssProperty(`--${locator}`, 100);
    })
  })
}

function setRootCssProperty(key, value) {
  document.documentElement.style.setProperty(key, `${value}`);
}

function eventBusFactory() {
  const listeners = {};

  function on(eventType, cb) {
    if (listeners[eventType]) {
      listeners[eventType] = listeners[eventType].concat(cb);
    } else {
      listeners[eventType] = [cb];
    }
  }

  function emit(eventType, payload) {
    listeners?.[eventType]?.forEach((cb) => cb(payload));
  }

  return { emit, on }
}
