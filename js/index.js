var words = ["Mario", "Luigi", "Wario", "Waluigi", "Peach", "Bowser"];

const url = "https://darkblue-frog-779608.hostingersite.com";

const btnRestart = document.getElementById("btnRestart");
const cards = document.querySelectorAll(".card");

var first = null;
var second = null;
let tries = 0;
var blocked = false;

var startTime, endTime;
var timeDiff;
var userName;

document.querySelector(".footer span").textContent = `Tentativas: ${tries}`;

function start() {
  let scrambledWords = scramble([...words, ...words]);
  startTime = new Date();
  first = null;
  second = null;
  tries = 0;
  blocked = false;
  document.querySelector(".footer span").textContent = `Tentativas: ${tries}`;

  cards.forEach((card, i) => {
    delete card.dataset.matched;
    card.textContent = "?";
    card.classList.remove("selected");
    card.dataset.word = scrambledWords[i];
    card.onclick = () => reveal(card);
  });
}

function check() {
  tries++;
  document.querySelector(".footer span").textContent = `Tentativas: ${tries}` 

  if (first.textContent == second.textContent) {
    first.dataset.matched = true;
    second.dataset.matched = true;

    first = null;
    second = null;


    const matchedCount = document.querySelectorAll('.card[data-matched="true"]').length;
    if (matchedCount === cards.length) {
      endTime = new Date();
      timeDiff = Math.round((endTime - startTime) / 1000); 
      
      setTimeout(() => {
        showWinningDialog();
        saveMatch();
      }, 100);
    }

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
}

function scramble(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (1 + i));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function saveMatch() {
  try {
    if (userName === "" || userName == null) {
      return;
    }

    const response = await fetch(`${url}/api/salvar.php`,{
      method: "POST",
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify({nome: `${userName}`, tempo: `${timeDiff}`, tentativas: `${tries}`}),
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}`)
    }
    console.log("SAVED SUCCESSFULLY")
  } catch (error) {
    console.log(error);
  }
}

async function getWords() {
  try {
    const req = await fetch(`${url}/api/palavras.php?quantidade=6`);

    if (!req.ok) {
      throw new Error(`Error ${req.status}`);
    }

    words = await req.json();
    start();
  } catch (error) {
    console.log(error);
  }
}

function showWinningDialog(){
  userName = prompt(
    `Parabéns, você completou o jogo com " + ${tries} + " tentativas!
    Digite seu nome para registrar sua pontuação`
  );
}

getWords();
btnRestart.onclick = () => getWords();
