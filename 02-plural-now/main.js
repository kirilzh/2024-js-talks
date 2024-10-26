const tick = tickManager();
const collection = createReactiveCollection();

collection.addObserver((property, value) => {
  if (property === 'push') {
    tick.create(value);
  }

  if (property === 'shift') {
    tick.move(value);
  }
});

document
  .querySelector('[data-locator="create-generator"]')
  .addEventListener('click', () => {
    const generator = collection.createGenerator();

    const timer = setInterval(() => generator.next(), 1000);

    const generatorList = document.querySelector('[data-locator="generator-list"]');
    createTimerNode(timer, generatorList);
  });

document
  .querySelector('[data-locator="create-iterator"]')
  .addEventListener('click', () => {
    const iterator = collection.createIterator();

    const timer = setInterval(() => iterator.next(), 1000);

    const iteratorList = document.querySelector('[data-locator="iterator-list"]');
    createTimerNode(timer, iteratorList);
  });

function createReactiveCollection() {
  let count = 0;
  const collection = [];
  const observers = [];

  const reactiveCollection = new Proxy(collection, {
    get(target, property, receiver) {
      const result = Reflect.get(target, property, receiver);

      if (property === 'shift') {
        return function (...args) {
          const value = result.apply(target, args);
          notify(property, value);
          return value;
        }
      }

      if (property === 'push') {
        return function (...args) {
          notify(property, args[0]);
          return result.apply(target, args);
        }
      }

      return result;
    }
  });

  function notify(property, value) {
    observers.forEach((observer) => observer(property, value));
  }

  return {
    addObserver: function (callback) {
      if (typeof callback === 'function') {
        observers.push(callback);
      }
    },

    createGenerator: function* () {
      while (true) {
        reactiveCollection.push(count);
        yield count;
        count += 1;
      }
    },

    createIterator: function* () {
      while (true) {
        if (reactiveCollection.length > 0) {
          const firstNode = reactiveCollection.shift();
          yield firstNode;
        } else {
          yield;
        }
      }
    },
  }
}

function tickManager() {
  const createdBlock = document.querySelector('[data-locator="created-ticks"]');
  const consumedBlock = document.querySelector('[data-locator="consumed-ticks"]')

  return {
    create: function (value) {
      const newNode = document.createElement('p');
      newNode.setAttribute('data-value', value);
      newNode.innerHTML = value;

      createdBlock.appendChild(newNode);
    },
    move: function (value) {
      const tick = document.querySelector(`[data-value="${value}"]`)

      consumedBlock.appendChild(tick);
    }
  }
}

function createTimerNode(timerId, target) {
  const row = document.createElement('li');
  const contentWrapper = document.createElement('div');
  contentWrapper.setAttribute('data-component', 'generator-list-item');

  const generatorId = document.createElement('p');
  generatorId.innerHTML = timerId;

  const stop = createButton('stop', () => {
    clearInterval(timerId);
    row.remove();
  });

  contentWrapper.appendChild(generatorId);
  contentWrapper.appendChild(stop);
  row.appendChild(contentWrapper);
  target.appendChild(row);
}

function createButton(text, listener) {
  const button = document.createElement('button');
  button.innerHTML = text;
  button.addEventListener('click', listener);

  return button;
}

