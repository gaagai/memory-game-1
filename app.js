const $score = document.getElementById("score")
const $steps = document.getElementById("steps")
const $timer = document.getElementById("timer")
const $start = document.getElementById("start")
const $board = document.getElementById("board")

const cards = [
  {
    title: "berries",
    url: "https://cdn.pixabay.com/photo/2010/12/13/10/05/berries-2277_1280.jpg",
  },
  {
    title: "pears",
    url:
      "https://cdn.pixabay.com/photo/2016/07/22/09/59/fruit-1534494_1280.jpg",
  },
  {
    title: "carrots",
    url:
      "https://cdn.pixabay.com/photo/2017/06/09/16/39/carrots-2387394_1280.jpg",
  },
  {
    title: "tomatoes",
    url:
      "https://cdn.pixabay.com/photo/2011/03/16/16/01/tomatoes-5356_1280.jpg",
  },
  {
    title: "peas",
    url: "https://cdn.pixabay.com/photo/2016/02/17/19/14/peas-1205673_1280.jpg",
  },
  {
    title: "strawberies",
    url:
      "https://cdn.pixabay.com/photo/2013/04/02/21/47/strawberries-99551_1280.jpg",
  },
]

let timer = 60
let currentSelections = []
let steps = 0

const countTime = () => {
  timerInterval = setInterval(() => {
    --timer
    $timer.innerText = timer

    if (timer === 0) {
      clearInterval(timerInterval)
    }
  }, 1000)
}

const shuffle = (array) => {
  let counter = array.length

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter)
    counter--
    let temp = array[counter]
    array[counter] = array[index]
    array[index] = temp
  }
  return array
}

const createBoard = (cards) => {
  //   console.log("cards", cards)
  $board.innerHTML = ""
  const shuffledCards = shuffle([...cards, ...cards])
  shuffledCards.forEach((card) => {
    const liElement = document.createElement("li")
    liElement.dataset.title = card.title
    const imgElement = document.createElement("img")
    imgElement.src = card.url
    imgElement.alt = card.title
    imgElement.title = card.title

    liElement.appendChild(imgElement)
    $board.appendChild(liElement)
  })
}

const startGame = () => {
  $start.classList.add("hidden")
  steps = 0
  createBoard(cards)
  clearInterval(timerInterval)
  countTime()
}
const calcScore = () => {
  let message
  if (steps <= cards.length * 2) {
    message = "Greate Memory!!!"
  } else if (steps <= cards.length * 2 + 5) {
    message = "Good job!"
    $score.innerHTML = 7
  } else {
    message = "You can do better"
    $score.innerHTML = 5
  }
  const openCards = document.getElementsByClassName("open")
  if (openCards.length / 2 === cards.length) {
    // clearInterval(timerInterval)
    setTimeout(() => {
      Swal.fire({
        title: message,
        icon: "success",
        showConfirmButton: true,
        confirmButtonText: "Play Again",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          startGame()
        }
      })
      $start.classList.remove("hide")
    }, 600)
  }
}

const hadleGameState = () => {
  steps++
  $steps.innerHTML = steps
  calcScore()
}

const handleSelections = (selectedArray) => {
  $board.classList.add("compare")
  setTimeout(() => {
    const isAMatch = selectedArray[0] === selectedArray[1]
    const flippedCards = Array.from(document.getElementsByClassName("flip"))
    // console.log(flippedCards)
    flippedCards.forEach((card) => {
      // console.log(card)
      if (isAMatch) {
        card.classList.replace("flip", "open")
      } else if (!isAMatch) {
        card.classList.remove("flip")
      }
    })
    $board.classList.remove("compare")
    hadleGameState()
  }, 800)
}

$board.addEventListener("click", ($event) => {
  const isCard = $event.target.localName === "li"
  const openCard = $event.target.classList.contains("open")
  const flipedCard = $event.target.classList.contains("flip")
  if (!isCard || openCard || flipedCard) {
    return
  }

  $event.target.classList.add("flip")
  currentSelections.push($event.target.dataset.title)
  console.log(currentSelections)
  if (currentSelections.length === 2) {
    handleSelections(currentSelections)
    currentSelections = []
  }
})

$start.addEventListener("click", () => {
  startGame()
})
