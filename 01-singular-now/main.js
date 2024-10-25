function initializeMemory() {
  let data;

  return {
    set: (value) => {
      data = value
    },
    get: () => data
  }
}

const memory = initializeMemory();

const input = document.getElementsByTagName('input').item(0);
const storeButton = document.getElementsByTagName('button').item(0);

const result = document.getElementsByTagName('h2').item(1);
const retrieveButton = document.getElementsByTagName('button').item(1);

storeButton.addEventListener('click', () => {
  memory.set(input.value);
});

retrieveButton.addEventListener('click', () => {
  result.innerHTML = `Value: ${memory.get()}`
})
