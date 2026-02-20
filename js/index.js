const words = ["Mario", "Luigi", "Wario", "Waluigi", "Peach", "Bowser"];
let revealedCards = []
const btnRestart = document.getElementById("btnRestart");
const cards = document.querySelectorAll(".card");
var first = null;
var second = null;
let tries = 0;
var blocked = false;

start()
btnRestart.onclick = () => start();

function start() {
    let scrambledWords = scramble([...words, ...words]);

    cards.forEach((card, i) => {
        card.textContent = "?";
        card.classList.remove("selected")
        card.dataset.word = scrambledWords[i];
        card.onclick = () => reveal(card);
    })
}

function check() {
    if (first.textContent == second.textContent) {
        first = null;
        second = null;
        console.log("Acertou");
    } else {
        blocked = true;
        setTimeout(() => {
            first.textContent = "?";
            second.textContent = "?";
            first.classList.remove("selected")
            second.classList.remove("selected")
            first = null;
            second = null;
        }, 1000)
        blocked = false;
    }
}

function reveal(card) {
    card.textContent = card.dataset.word;
    card.classList.add("selected")
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