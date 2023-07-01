"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const bestScoreCount = document.querySelector('.best-score-count');
bestScoreCount.innerHTML = localStorage.getItem("fewest-moves");

const delay = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple"
];


function randomlyExtendArray(arr) {
  let newArr = [...arr];
  let randomNum = Math.floor(Math.random() * 6);
  for (let i = 0; i < randomNum; i++) {
    let randomColorIndex = Math.floor(Math.random() * (newArr.length));

    for (let j = 0; j < 2; j++) {
       newArr.push(newArr[randomColorIndex]);
    }
  }
  return newArr;
}

let colors = randomlyExtendArray(COLORS);
colors = shuffle(colors);

function shuffle(arr) {

  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

const startButton = document.querySelector('.start-button');
const restartButton = document.querySelector('.restart-button');
const currentScore = document.querySelector('.current-score');
const gameBoard = document.getElementById("game-board");

let gameInitiated = false;
startButton.addEventListener("click", () => {
  if (gameInitiated) {
    return;
  }
  createCards(colors);
  gameInitiated = true;
});

restartButton.addEventListener("click", () => {
  if (!gameInitiated) {
    return;
  } else {
      gameBoard.innerHTML = '';
      colors = shuffle(randomlyExtendArray(COLORS));
      createCards(colors);
      moves = 0;
      currentScore.innerHTML = 0;
      correctCount = 0;
      activeCard = null;
      twoSelected = false;
    }
});

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

let correctCount = 0;
let activeCard = null;
let twoSelected = false;
let moves = 0;

function createCards(colors) {

  let fewestMoves = JSON.parse(localStorage.getItem("fewest-moves"));

  for (let color of colors) {

    let cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');
    gameBoard.appendChild(cardContainer);

    let card = document.createElement('div');
    card.classList.add('card');
    cardContainer.appendChild(card);
    card.setAttribute("data-correct", "false");

    let cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    card.appendChild(cardFront);

    let cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    cardBack.style.backgroundColor = `${color}`;
    card.appendChild(cardBack);

    cardContainer.addEventListener('click', (e) => {
      const correct = card.getAttribute("data-correct");
      if (twoSelected || correct === "true" || card === activeCard) {
        return;
      }

      flipCard(card);
      moves++;
      currentScore.innerHTML = String(moves);

      if (!activeCard) {
        activeCard = card;
        activeCard.style.pointerEvents = 'none';
        return;
      }

      let firstColor = activeCard.lastElementChild.style.backgroundColor;

      if (firstColor === color) {
        activeCard.setAttribute("data-correct", "true");
        card.setAttribute("data-correct", "true");

        twoSelected = false;
        activeCard = null;
        correctCount += 2;

          if (correctCount === colors.length) {
            if (moves < Number(fewestMoves) || !fewestMoves) {
              localStorage.setItem("fewest-moves", moves);
              bestScoreCount.innerHTML = localStorage.getItem("fewest-moves");
            }

            setTimeout(() => {
              alert('You win!');
            }, delay)
          }
        return;
      }

      twoSelected = true;

      setTimeout(() => {
        unFlipCard(card);
        unFlipCard(activeCard);

        twoSelected = false;
        activeCard = null;
      }, delay)

    });
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  card.classList.add('flipped');
}

/** Flip a card face-down. */

function unFlipCard(card) {
  card.classList.remove('flipped');
}
