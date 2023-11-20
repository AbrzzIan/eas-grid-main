

//Selects the grid container and the slider
let grid = document.querySelector(".grid-container")
let slider = document.querySelector(".grid-size")

//Gets the slider value
let gridSize = slider.value;


let cleanGridBtn = document.querySelector(".clean-grid")

//Calculates the height of the grid's squares
let calculateGridHeight = (gridSize) => 1400/(gridSize)
let height = calculateGridHeight(gridSize);
let gameArray = []
let nextArray = []

//Toggles the painted value in the array
TogglePaintedInArray = (x,y,array) => {
    array[x][y].painted = array[x][y].painted ? false : true
}
//Toggles the painted class in the board
TogglePaintedInBoard = (x,y) => {
    let square = document.getElementsByClassName(`x${x} y${y}`)[0]
    square.classList.toggle("painted")
}


//Check the surronding squares of a given square and returns the painted neighbors
checkSurrondingSquares = (x,y) => {
    let amount = 0
    gameArray[x+1] && gameArray[x+1][y+1] && gameArray[x+1][y+1]?.painted && amount++
    gameArray[x+1] && gameArray[x+1][y] && gameArray[x+1][y]?.painted && amount++
    gameArray[x+1] && gameArray[x+1][y-1] && gameArray[x+1][y-1]?.painted && amount++
    gameArray[x][y+1] && gameArray[x][y+1]?.painted && amount++
    gameArray[x][y-1] &&gameArray[x][y-1]?.painted && amount++
    gameArray[x-1] && gameArray[x-1][y+1]?.painted && amount++
    gameArray[x-1] &&gameArray[x-1][y]?.painted && amount++
    gameArray[x-1] && gameArray[x-1][y-1] && gameArray[x-1][y-1]?.painted && amount++
    nextArray[x][y].neighbors = amount
    return amount
}


//Checks the neighbors of the given square and toggles painted status if necessary
checkSquares = (x,y) => {

    neighbors = checkSurrondingSquares(x,y)
    if (gameArray[x][y].painted) {
        if (neighbors == 0 || neighbors == 1) {
            TogglePaintedInBoard(x,y)
            TogglePaintedInArray(x,y,nextArray)

        }
        else if (neighbors > 3) {
            TogglePaintedInBoard(x,y)
            TogglePaintedInArray(x,y,nextArray)
        }
    }
    else {
        if (neighbors == 3) {
            TogglePaintedInBoard(x,y)
            TogglePaintedInArray(x,y,nextArray)
        }
    }
    
}

//Adds the onclick listeners for each square
gridSquaresEvent = () => {
    let gridSquares = document.querySelectorAll(".grid-square")
    gridSquares.forEach( (e)  => e.addEventListener('click', (e) => {
        
        TogglePaintedInArray(e.target.classList[1].slice(1),e.target.classList[2].slice(1),gameArray)
        TogglePaintedInBoard(e.target.classList[1].slice(1),e.target.classList[2].slice(1))
    }
    ))
}

//Creates the grid
createGrid = (gridSize) => {
    

    for (let row = 0;row<gridSize;row++) {

        let gridRow = document.createElement("div");
        gameArray.push([])
        gridRow.style.width = '100%';
        gridRow.classList.add("grid-row");

        grid.appendChild(gridRow);
        for (let column = 0;column<gridSize;column++) {

            gameArray[row].push({
                "x" : row,
                "y" : column,
                "painted" : false,
                "neighbors" : 0,
            }
            )
            
            let gridSquare = document.createElement("div")

            gridSquare.style.height = `${height}px`;
            gridSquare.style.boxSizing = `border-box`
            gridSquare.style.borderRight = `thin solid black`
            gridSquare.style.borderBottom = `thin solid black`
            gridSquare.classList.add('grid-square');
            gridSquare.classList.add(`x${gameArray[row][column].x}`);
            gridSquare.classList.add(`y${gameArray[row][column].y}`);
            
            gridRow.appendChild(gridSquare);
        }
        
    }
    gridSquaresEvent();
}

createGrid(gridSize);



//Empties the game arrays, stops the simulation and removes the grid container childs
cleanGrid = () => {
    gameArray = []
    nextArray = []

    toggleGame("stop")
    for (let row = 0;row<gridSize;row++) {
        gridRow = document.querySelector('.grid-row')
        grid.removeChild(gridRow)
        
    }
}

  



cleanGridBtn.addEventListener('click', () => {
    cleanGrid();
    createGrid(gridSize);
})



let sliderContainer = document.querySelector('.slider-container')
let currentGridSize = document.createElement("p");
currentGridSize.classList.add('current-grid-size');

//Creates the text below the slider
gridSizeText = () => {
currentGridSize.textContent = `${slider.value}x${slider.value}`
sliderContainer.appendChild(currentGridSize);
}

gridSizeText();

//When the slider value changes, creates a new game, calculates the new grid height and updates the slider text
slider.oninput = () => {

    cleanGrid();
    gridSize = slider.value;
    height = calculateGridHeight(gridSize)
    createGrid(gridSize)
    gridSizeText();
}
  

let nextStepBtn = document.querySelector(".next")


//Runs the next step of the simulation when called
const nextStep = () => {

    //Needs to create a new array that doesnt reference the other one, AFAIK its the only way
    nextArray = JSON.parse(JSON.stringify(gameArray))

    let gridSquares = document.querySelectorAll(".grid-square")
    for (let i = 0; i < gridSquares.length; i++) {
        let x = Number(gridSquares[i].classList[1].slice(1))
        let y = Number(gridSquares[i].classList[2].slice(1))
        checkSquares(x,y)
    }

    //nextArray becomes the current gameArray
    gameArray = JSON.parse(JSON.stringify(nextArray))
}


nextStepBtn.addEventListener("click", () => nextStep())

let startBtn = document.querySelector(".start")
let intervalId = ""

//Adds and interval to the nextStep function
const toggleGame = (status) => {
    if (status == "start") {
        intervalId = setInterval(nextStep,350)
    }
    else if (status == "stop") {

        if (intervalId != "") clearInterval(intervalId)
    }
}
startBtn.addEventListener("click", () => {
    toggleGame("start")
})


console.log(intervalId)