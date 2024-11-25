/**
 * 01 Simplest example
 */

const data = { value: "Hello" };
const content = document.createTextNode(data.value);
const paragraph = document.createElement("p");
paragraph.appendChild(content)
document.body.appendChild(paragraph);

// after some time
data.value = "Hello JS.Talks()";

// ============================================================================
