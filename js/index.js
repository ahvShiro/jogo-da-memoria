const words = ["Mario", "Luigi", "Wario", "Waluigi", "Peach", "Bowser"];
const btnRestart = document.getElementById("btnRestart");
const cards = document.querySelectorAll(".card");
var first = null;
var second = null;
let tries = 0;
var blocked = false;

function start() {
  let scrambledWords = scramble([...words, ...words]);

  first = null;
  second = null;
  tries = 0;
  blocked = false;

  cards.forEach((card, i) => {
    delete card.dataset.matched;
    card.textContent = "?";
    card.classList.remove("selected");
    card.dataset.word = scrambledWords[i];
    card.onclick = () => reveal(card);
  });
}

function check() {
  if (first.textContent == second.textContent) {
    first.dataset.matched = true;
    second.dataset.matched = true;

    first = null;
    second = null;
    console.log("Acertou");
  } else {
    blocked = true;
    setTimeout(() => {
      first.textContent = "?";
      second.textContent = "?";
      first.classList.remove("selected");
      second.classList.remove("selected");
      first = null;
      second = null;
      blocked = false;
    }, 500);
  }
}

function reveal(card) {
  if (card.dataset.matched || blocked) {
    return;
  }
  if (card == first) {
    return;
  }
  card.textContent = card.dataset.word;
  card.classList.add("selected");
  if (!first) {
    first = card;
    return;
  }
  second = card;
  check();
  tries++;
}

function scramble(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (1 + i));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

start();
btnRestart.onclick = () => start();