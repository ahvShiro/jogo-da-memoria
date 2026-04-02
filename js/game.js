import * as Api from "./api.js";

const cards = document.querySelectorAll(".card");

let first = null;
let second = null;
let tries = 0;
let blocked = false;
let words = [];

var startTime;
var endTime;
var timeDiff;
var userName;

function resetGame() {
  first = null;
  second = null;
  tries = 0;
  blocked = false;
  words = [];
  startTime = new Date();
  endTime = null;
  timeDiff = null;
}

export async function start() {
  console.log("GAME START")
  resetGame();
  words = await Api.getWords();
  let scrambledWords = scramble([...words, ...words]);
  
  // Pra cada carta
  cards.forEach((card, i) => {
    delete card.dataset.matched;
    card.textContent = "?";
    card.classList.remove("selected");
    card.dataset.word = scrambledWords[i];
    card.onclick = () => reveal(card);
  });
}

function addTry() {
  tries++;
  document.querySelector(".footer span").textContent = `Tentativas: ${tries}` 
}

function check() {
  // uma tentativa foi feita: aumenta o contador
  addTry();

  // usuário errou
  if (first.textContent != second.textContent) {
    blockTries();
    return;
  }

  // as duas cartas foram matchadas
  first.dataset.matched = true;
  second.dataset.matched = true;

  // reseta o first e o second
  first = null;
  second = null;
  
  checkGameWon();
}

function checkGameWon() {
  if (document.querySelectorAll('.card[data-matched="true"]').length === cards.length) {
    stopTimer()

    setTimeout(() => {
      userName = getUserNameFromDialog();

      try {
        Api.saveMatch(parseMatch());
      } catch (error) {
        if (error.code === "USERNAME_REQUIRED") {
          console.log("Nome de usuário inválido. Tente novamente");
        }
      }

    }, 100);
  }
}

function stopTimer() {
  endTime = new Date();
  timeDiff = Math.round((endTime - startTime) / 1000); 
}

function blockTries() {
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

function reveal(card) {
  // guard clause: se acertou a carta ou tá no período de bloqueio, não permite revelar
  if (card.dataset.matched || blocked) {
    return;
  }
  // se o usuário selecionou a mesma carta dnv, não permite revelar
  if (card == first) {
    return;
  }
  // revela a carta
  card.textContent = card.dataset.word;

  // carta fica com a classe selected
  card.classList.add("selected");
  
  // se o primeiro tá vazio atribui o first com a carta revelada
  // se o primeiro tem coisa, atribui a carta revelada no second e checa
  if (!first) {
    first = card;
  } else {
    second = card;
    check();
  }
}

function scramble(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (1 + i));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * @returns {string}
 */
function getUserNameFromDialog(){
  return prompt(
    `Parabéns, você completou o jogo com ${tries} tentativas e em ${timeDiff} segundos! Digite seu nome para registrar sua pontuação no servidor:`
  );
}

function parseMatch() {
  return {nome: `${userName}`, tempo: `${timeDiff}`, tentativas: `${tries}`};
}