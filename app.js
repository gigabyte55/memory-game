const startGameButton = document.getElementById("start-game-button");
let startTime;
let endTime;
let tableSize;
let firstCard = null;
let secondCard = null;

startGameButton.addEventListener("click", function () {
  const tableSizeOptions = document.getElementsByName("table-size");
  tableSizeOptions.forEach((element) => {
    if (element.checked) {
      tableSize = element.value;
      initGame();
    }
  });
});

function initGame() {
  document.getElementById("set-table-size").style.display = "none";
  createTable();
}

function createTable() {
  startTime = new Date();
  const gameBoard = document.getElementById("game-board");
  const numberOfDifferentCards = (tableSize * tableSize) / 2;
  const cardsValues = Array.from(
    { length: numberOfDifferentCards },
    (_, i) => i + 1
  );
  const cards = shuffleCards(cardsValues.concat(cardsValues));
  let row;
  let rowNumber = 0;
  for (let i = 0; i < cards.length; i++) {
    if (i % tableSize === 0) {
      rowNumber++;
      row = gameBoard.appendChild(document.createElement("div"));
      row.classList.add("table-row");
    }
    const card = row.appendChild(document.createElement("div"));
    card.classList.add("table-card");
    card.setAttribute("data-card-value", cards[i]);
    card.setAttribute("id", i);
    card.addEventListener("click", flipCard);
    const cardText = card.appendChild(document.createElement("p"));
    cardText.innerText = cards[i];
  }
}

function shuffleCards(cardsArray) {
  for (let i = cardsArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];
  }
  return cardsArray;
}

function flipCard(event) {
  if (!event.target.classList.contains("table-card")) {
    return;
  }
  if (firstCard && secondCard) {
    return;
  }
  let card = event.target;
  if (firstCard && firstCard.attributes.id.value === card.attributes.id.value) {
    return;
  }
  card.classList.add("flip");
  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    checkMatch();
  }
}

function checkMatch() {
  if (
    firstCard.attributes["data-card-value"].value ===
    secondCard.attributes["data-card-value"].value
  ) {
    firstCard.classList.add("matched");
    firstCard.removeEventListener("click", flipCard);
    secondCard.classList.add("matched");
    secondCard.removeEventListener("click", flipCard);
    firstCard = null;
    secondCard = null;
  } else {
    setTimeout(() => {
      resetCards();
    }, 1000);
  }
  checkPairs();
}

function checkPairs() {
  const matchedCards = document.querySelectorAll(".matched");
  if (matchedCards.length === tableSize * tableSize) {
    endTime = new Date();
    let timeDiff = endTime - startTime;
    timeDiff /= 1000;
    const seconds = Math.round(timeDiff);
    setTimeout(() => {
      alert(
        "Congrats, you completed the " +
          tableSize +
          "x" +
          tableSize +
          " game in " +
          seconds +
          " seconds."
      );
    }, 500);
  }
}

function resetCards() {
  firstCard = null;
  secondCard = null;
  const cards = document.querySelectorAll(".table-card");
  cards.forEach((card) => {
    card.classList.remove("flip");
  });
}
