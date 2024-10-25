const fibonacci = fibonacciGenerator();
const iterator = fibonacciIterator();

function* fibonacciGenerator() {
  let result = 0;
  let increment = 1;

  while (true) {
    yield result;
    let temporary = result;
    result = increment;
    increment = temporary + increment;
  }
}

function fibonacciIterator() {
  return {
    next() {
      const nodes = document.querySelectorAll('[data-value]');

      if (!nodes.length) {
        return { done: true, value: null }
      }

      const node = nodes.item(0);
      const value = node.getAttribute('data-value');
      node.remove();

      return { done: false, value }
    }
  }
}

let intervalId;

document
  .querySelector('[data-locator="start-generator"]')
  .addEventListener('click', () => {
    intervalId = setInterval(appendNextFibonacciNumber, 1000);
  });

document
  .querySelector('[data-locator="resume-generator"]')
  .addEventListener('click', () => {
    intervalId = setInterval(appendNextFibonacciNumber, 1000);
  })

document
  .querySelector('[data-locator="pause-generator"]')
  .addEventListener('click', () => {
    clearInterval(intervalId);
  });

document
  .querySelector('[data-locator="start-iterator"]')
  .addEventListener('click', () => {
    setInterval(() => {
      iterator.next();
    }, 500);
  });



function appendNextFibonacciNumber() {
  const resultBlock = document.querySelector('[data-locator="result-block"]');
  const newNode = document.createElement('p');
  const { value } = fibonacci.next();
  newNode.setAttribute('data-value', `${value}`);
  newNode.innerHTML = `${value}`;

  resultBlock.appendChild(newNode);
}
