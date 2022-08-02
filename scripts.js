// John Ropa
// COMP 6970
// Dr. Seals
// Auburn University Spring 2022

const gameDisplay = document.getElementById('game')
const scoreDisplay = document.getElementById('score')
let score = 0

const categories = [
    {
        name: 'Addition'
    },
    {
        name: 'Subtraction'
    },
    {
        name: 'Division'
    },
    {
        name: 'Multiplication'
    }
]

const difficulties = ['easy', 'medium', 'hard']

function displayCategory(category) {
    // creating a div element to house the category's questions
    const column = document.createElement('div')
    column.classList.add('category-column')
    column.innerHTML = category.name
    gameDisplay.append(column)

    difficulties.forEach(difficulty => {
        const card = document.createElement('div')
        card.classList.add('card')
        column.append(card)

        switch(difficulty) {
            case 'easy':
                card.innerHTML = 100
                break;
            case 'medium':
                card.innerHTML = 200
                break;
            case 'hard':
                card.innerHTML = 300
                break;
            default:
                card.innerHTML = 0
        }
        let randomNumber;
        randomNumber = Math.floor(Math.random() * 2)
        const categoryName = category.name.toLowerCase()

        fetch(`questions/${categoryName}-${difficulty}.json`)
            .then(response => response.json())

            .then(data => {
                        card.setAttribute('question', data.results[randomNumber].question)
                        card.setAttribute('answer', data.results[randomNumber].correct_answer)
                        card.setAttribute('points', card.getInnerHTML())
                        // card.setAttribute('answers',data.results[0].answers)
                        let answers = []
                        answers = data.results[randomNumber].answers
                        questionShuffler(answers)
                        card.setAttribute('answers', answers)

            })
            .then(done => {
                card.addEventListener('click', showQuestion)
            });

    })

}

categories.forEach(category =>{
    displayCategory(category)
})

function showQuestion(){
    // clear the previous text from the selected card
    this.innerHTML = ''
    // styling
    this.classList.add('active')
    this.style.fontSize = '32px'
    this.style.fontFamily = 'Trebuchet MS'
    this.style.lineHeight = '24px'
    this.style.paddingTop = '30px'
    const questionText = document.createElement('div')
    questionText.style.paddingBottom = '20px'
    const a_Button = document.createElement('button')
    const b_Button = document.createElement('button')
    // this one is a line break
    const br = document.createElement('div')
    const c_Button = document.createElement('button')
    const d_Button = document.createElement('button')

    // add styling to the buttons
    a_Button.classList.add('button', 'a-button')
    b_Button.classList.add('button','b-button')
    c_Button.classList.add('button', 'c-button')
    d_Button.classList.add('button','d-button')

    const answers = this.getAttribute('answers')
    const check = answers.split(',')
    console.log(check)
    // display the answers in the buttons
    a_Button.innerHTML = check[0]
    b_Button.innerHTML = check[1]
    c_Button.innerHTML = check[2]
    d_Button.innerHTML = check[3]

    // add event listeners to the multiple guess buttons
    a_Button.addEventListener('click', checkAnswer)
    b_Button.addEventListener('click', checkAnswer)
    c_Button.addEventListener('click', checkAnswer)
    d_Button.addEventListener('click', checkAnswer)


    questionText.innerHTML = this.getAttribute('question')
    this.append(questionText, a_Button,b_Button,br,c_Button,d_Button)

    const allCards = Array.from(document.querySelectorAll('.card'))
    allCards.forEach(card => card.removeEventListener('click',showQuestion))

}

//  Check the selected answer that the player choose from the card

function checkAnswer() {
    this.classList.remove('active')
    let times = 0
    // create array using the card class.
    const allCards = Array.from(document.querySelectorAll('.card'))
    // on click call showQuestion function
    allCards.forEach(card => card.addEventListener('click',showQuestion))
    // add a class and some styling to up the font size to match initial state
    this.parentElement.classList.add('scoredisplay')
    this.parentElement.style.fontSize = '120px'
    this.parentElement.style.lineHeight = '180px'
    this.parentElement.style.paddingTop = '10px'
    this.parentElement.style.fontFamily = 'Impact'
    const answeredQuestion = this.parentElement
    if ((answeredQuestion.getAttribute('answer') === this.innerHTML)) {
        // be sure the text is cleared before writing new
        answeredQuestion.innerHTML = ''
        // get the points of the selected card
        score = score + parseInt(answeredQuestion.getAttribute('points'))
        // display the score in the browser
        scoreDisplay.innerHTML = score
        // set class to correct if answer is correct
        answeredQuestion.classList.add('correct-answer')

        setTimeout(() => {
            while (answeredQuestion.firstChild) {
                answeredQuestion.removeChild(answeredQuestion.lastChild)
            }
            answeredQuestion.innerHTML = answeredQuestion.getAttribute('points')

        }, 100)
    } else{
        // be sure the text is cleared before writing new
        answeredQuestion.innerHTML = ''
        answeredQuestion.classList.add('wrong-answer')
        setTimeout(() => {
            while (answeredQuestion.firstChild) {
                answeredQuestion.removeChild(answeredQuestion.lastChild)
            }
            answeredQuestion.innerHTML = 0
        }, 100)
    }
    answeredQuestion.removeEventListener('click', showQuestion)
    if(times = 0){
        startTimer()

    }

    ++times

}


// What I wanted to do with this function was remove or hide the other elements.
// The idea was to make the question card move and enlarge over the center of the sceen
// where it would become the focus.
// this successfully remove the sibling elements, however, the other columns
// are more like cousins so I have to make it so it walks through each column to remove the elements.

function removeElementsByClass(className){
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }

    while (this.nextElementSibling) {
        this.nextElementSibling.remove();

    }
}

// This function rearranges the answers in order to get a somewhat random placement
// of the correct answer so it won't always be in the same location

function questionShuffler(newArray) {
    let currentIndex = newArray.length,  randomIndex;
    // While there are still answers available
    while (currentIndex != 0) {
        // Select one of the answers
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // swap places with the current answer.
        [newArray[currentIndex], newArray[randomIndex]] = [
            newArray[randomIndex], newArray[currentIndex]];
    }
    return newArray;
}

// add a time counter to record how long it takes to complete the game.
function startTimer(){
    elapsedTime = setInterval(setTime, 1000);
}

// set variables for displaying the ticking timer
const minutesLabel = document.getElementById("minutes");
const secondsLabel = document.getElementById("seconds");
let totalSeconds = 0;

// increment total seconds and update 
function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}
// adjust padding for single digits
function pad(val) {
    const valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

// restart the game button will simply refresh the screen for now
function reStart(){
    window.location.href=window.location.href
}

// pauses or stops the timer when player completes the round
function stopTimer(){
    clearInterval(elapsedTime)
}

// pending additon.  The idea is to store the session as a cookie
// to provide a way to display the previous high score / time combo
document.cookie = 'Rocket_Math_Score ='


