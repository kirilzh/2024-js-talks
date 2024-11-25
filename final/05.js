// Create HTML elements dynamically
const inputElement = document.createElement('input');
inputElement.id = 'textInput';
inputElement.placeholder = 'Type to search...';

document.body.appendChild(inputElement);

// Observable Class
class Observable {
  constructor(subscribe) {
    this._subscribe = subscribe;
  }

  subscribe(observer) {
    return this._subscribe(observer);
  }

  pipe(...operators) {
    return operators.reduce((prevObservable, operator) => operator(prevObservable), this);
  }
}

// Debounce Operator
function debounce(delay) {
  return function (source) {
    return new Observable((observer) => {
      let timeoutId;

      const subscription = source.subscribe({
        next(value) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            console.log('[DEBOUNCE]', value);
            observer.next(value);
          }, delay);
        },
        error(err) {
          observer.error(err);
        },
        complete() {
          clearTimeout(timeoutId);
          observer.complete();
        },
      });

      return {
        unsubscribe() {
          clearTimeout(timeoutId);
          if (subscription && subscription.unsubscribe) {
            subscription.unsubscribe();
          }
        },
      };
    });
  };
}

// Map Operator
function map(transformFn) {
  return function (source) {
    return new Observable((observer) => {
      const subscription = source.subscribe({
        next(value) {
          try {
            const transformed = transformFn(value);
            console.log('[MAP]', transformed);
            observer.next(transformed);
          } catch (err) {
            observer.error(err);
          }
        },
        error(err) {
          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      });

      return {
        unsubscribe() {
          if (subscription && subscription.unsubscribe) {
            subscription.unsubscribe();
          }
        },
      };
    });
  };
}

function createEventObservable(element, eventType) {
  return new Observable((observer) => {
    function handleEvent(event) {
      observer.next(event);
    }

    element.addEventListener(eventType, handleEvent);

    return {
      unsubscribe() {
        element.removeEventListener(eventType, handleEvent);
      },
    };
  });
}

// Simulate an API Call Function
function fetchData(query) {
  // Simulate an API call by returning a promise
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Results for "${query}"`);
    }, 1000); // Simulated network delay of 1 second
  });
}

// Create the input observable for 'input' events
const inputObservable = createEventObservable(inputElement, 'input')
  .pipe(
    map(event => event.target.value),
    debounce(500)
  );

// Subscribe to the input observable to make an API call for each debounced input
const inputSubscription = inputObservable.subscribe({
  next: (value) => {
    if (value.trim() === '') {
      console.log('Empty input. Skipping API call.');
      return;
    }

    console.log('[ON SUBSCRIBE]', value);

    fetchData(value)
      .then((results) => {
        console.log('API Response:', results);
      })
      .catch((error) => {
        console.error('API Error:', error);
      });
  },
  error: (err) => {
    console.error('Observable Error:', err);
  },
  complete: () => {
    console.log('Input Observable completed.');
  },
});

function unsubscribe() {
  inputSubscription.unsubscribe();
  console.log('Unsubscribed from all observables.');
}
