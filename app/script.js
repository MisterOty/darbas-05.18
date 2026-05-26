//1. Multiplayer Room System:
    //Create/Join game rooms
    //Handle player connections/disconnections
    //Use Socket.IO or WebSockets
//2. Live Quiz Engine:
    // Real-time question synchronization
    // Timer countdown system
    // Automatic score updates
    // Handle next-question transition
//3. Quiz Interface UI:
    //Build responsive quiz screens
    //Display questions/answers, cleanly
    //Show timers, player list, scores
    // Mobile-friendly layout
//4. Leaderboard & Results Page:
    //Final reankings screen
    //Animated score updates
    //Display corrent/wrong answers
    //"Play again" functionality
//5. Trivia API Intergration:
    //Connect trivia/question API
    //Fetch categories/difficulty levels
    //Randomize questions
    //Handle API failures gracefully
//6. User Accounts & Match History:
    //Authentication system
    //Save match history/scores
    //Player statistics dashboard
    //Store data in database

//IDEA 1#:
//If quiz difficulty is set to Expert, make design like impossible quiz
//IDEA 2#:
//Make a emoji wheel where you can taunt other players

// BUG 1#:
// Some categories doesnt have much or any boolean questions

let api = 'https://opentdb.com/api_config.php'

let gameInfo = {
    currentQuestion: 0,
    gameType: "Any Category",
    difficulty: "Any Difficulty",
    questions: []
}

let scoreTrack = {
    answeredQ: [],
    score: [0, 0],
    lngstS: 0,
    streak: 0,
}

let players = [
    {
        name: "Lorem Ipsom",
        scoreTrack: {
            answeredQ: [],
            lngstS: 0,
            streak: 0,
        }
    }
]

let minMaxQuestions = [5, 20]

let timerTime = 0
let timerTimeSnap = 0
let timerInterval

let credits = {
    names: ["Oskaras Venzlauskas", "Justas Brazaitis", "Kajus Podžiulaitis"],
    class: "GJSM23"
}

let categories = [
    ["Any Category", 0], 
    ["General Knowledge", 9],
    ["Mythology", 20],
    ["Sports", 21],
    ["Geography", 22],
    ["History", 23],
    ["Politics", 24],
    ["Art", 25],
    ["Celebrities", 26],
    ["Animals", 27],
    ["Vehicles", 28],
    {
        name: "Entertainment",
        type: [
            ["Books", 10],
            ["Film", 11],
            ["Music", 12],
            ["Musical & Theatres", 13],
            ["Television", 14],
            ["Video Games", 15],
            ["Board Games", 16],
            ["Comic", 29],
            ["Japanese Anime & Manga", 31],
            ["Cartoons & Animations", 32]
        ]
    },
    {
        name: "Science",
        type: [
            ["Nature", 17],
            ["Computers", 18],
            ["Mathematics", 19],
            ["Gadgets", 30]
        ]
    }
]

let difficulties = [
    ["Any Difficulty", 0],
    ["Easy", "easy"],
    ["Normal", "medium"],
    ["Expert", "hard"]
]

let types = [
    ["Any Type", 0],
    ["Multiple Choice", "multiple"],
    ["True or False", "boolean"]
]

//MISC FUNCTIONS

const getAPIInfo = async (link) => {
    try{
        const response = await fetch(link);
        if(!response.ok){
            throw new Error("Could not fetch resource");
        }
        const data = await response.json();
        return data
    }catch(error){
        console.error("Search failed:", error);
    }
}

const shuffleArray = (array) => {
    for(let i = array.length - 1; i > 0; i--){
        const random = Math.floor(Math.random() * (i + 1));
        [array[i], array[random]] = [array[random], array[i]];
    }
    return array;
}

function doRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const limitInput = (num) => {
    let number = num
    if(number > minMaxQuestions[1]){
        number = minMaxQuestions[1]
    }else if(number < minMaxQuestions[0]){
        number = minMaxQuestions[0]
    }
    return number
}

//MAIN MENU AND GAME CREATION

// const createStartMenu = () => {

// }

const createRoom = () => {
    const main = document.querySelector('main')
    let createDiv = document.createElement('div')
    createDiv.classList.add('questions-creator')
    let titles = ["Number of Questions", "Categories:", "Difficulty:", "Select Type:"]
    let id = ["number-questions", "category", "difficulty", "type"]
    //TEMP FIX: THE API DOESNT HAVE ENOUGH QUESTIONS AND ANSWERS FOR SOME CATEGORIES SO FOR NOW ANY WILL DO
    titles = ["Number of Questions", "Difficulty:", "Select Type:"]
    id = ["number-questions", "difficulty", "type"]
    let childDiv
    let text
    for(let o = 0; o < titles.length; o++){
        text = document.createElement('p')
        text.innerHTML = `${titles[o]}`
        if(id[o] == "number-questions"){
            childDiv = document.createElement('input')
            childDiv.id = id[o]
            childDiv.type = `number`
            childDiv.value = `${minMaxQuestions[0]}`
        }else{
            childDiv = document.createElement('select')
        }
        if(id[o] == "category"){
            childDiv.id = id[o]
            for(let i = 0; i < categories.length; i++){
                if(categories[i].name !== undefined){
                    for(let e = 0; e < categories[i].type.length; e++){ 
                        childDiv.innerHTML += `<option value="${categories[i].type[e][1]}">${categories[i].name}: ${categories[i].type[e][0]}</option>`
                    }
                }else{
                    childDiv.innerHTML += `<option value="${categories[i][1]}">${categories[i][0]}</option>`
                }
            }
        }else if(id[o] == "difficulty"){
            childDiv = document.createElement('select')
            childDiv.id = id[o]
            for(let i = 0; i < difficulties.length; i++){
                childDiv.innerHTML += `<option value="${difficulties[i][1]}">${difficulties[i][0]}</option>`
            }
            createDiv.appendChild(childDiv)
        }else if(id[o] == "type"){
            childDiv = document.createElement('select')
            childDiv.id = id[o]
            for(let i = 0; i < types.length; i++){
                childDiv.innerHTML += `<option value="${types[i][1]}">${types[i][0]}</option>`
            }
            createDiv.appendChild(childDiv)
        }
        createDiv.appendChild(text)
        createDiv.appendChild(childDiv)
    }
    childDiv = document.createElement('button')
    childDiv.id = `create-api-text`
    childDiv.innerHTML = `Create Questions`
    createDiv.appendChild(childDiv)

    main.appendChild(createDiv)
}

const createQuestions = async () => {
    let link = "https://opentdb.com/api.php?"
    let id = ["number-questions", "category", "difficulty", "type"]
    let suffix = ["amount", "category", "difficulty", "type"]
    //TEMP FIX: THE API DOESNT HAVE ENOUGH QUESTIONS AND ANSWERS FOR SOME CATEGORIES SO FOR NOW ANY WILL DO
    id = ["number-questions", "difficulty", "type"]
    suffix = ["amount", "difficulty", "type"]
    let text
    for(let i = 0; i < id.length; i++){
        if(id[i] == "number-questions"){
            text = document.querySelector(`#${id[i]}`)
        }else{
            text = document.querySelector(`#${id[i]}`).selectedOptions[0]
        }
        if(text.value !== "0"){
            link += `&${suffix[i]}=${text.value}`
        }
    }
    let output = await getAPIInfo(link)
    doGameInfo(output)
    createQuestion()
}

const doGameInfo = (data) => {
    // gameInfo.gameType = categories[document.querySelector(`#category`).value][0]
    // gameInfo.difficulty = difficulties[document.querySelector(`#difficulty`).value][0]
    for(let i = 0; i < data.results.length; i++){
        let doAnswers = data.results[i].incorrect_answers
        doAnswers.push(data.results[i].correct_answer)
        if(data.results[i].type !== "boolean"){
            shuffleArray(doAnswers)
        }else{
            doAnswers = ["True", "False"]
        }
        let object = {
            category: data.results[i].category,
            difficulty: data.results[i].difficulty,
            question: {
                text: data.results[i].question,
                answer: doAnswers,
                correct: data.results[i].correct_answer,
            }
        }
        gameInfo.questions.push(object)
    }
    console.log(gameInfo)
}

//GAME FUNCTIONS

const createQuestion = () => {
    if(gameInfo.currentQuestion == gameInfo.questions.length){
        createEndScreen()
        return
    }
    const main = document.querySelector('main')
    main.innerHTML = ``

    let current = gameInfo.questions[gameInfo.currentQuestion]
    let showTime = current.question.text.length * 75
    let timer = 10
    if(current.difficulty == "hard"){
        timerTime = timer * 5
    }else if(current.difficulty == "normal"){
        timerTime = timer * 3
    }else{
        timerTime = timer * 2
    }
    timerTimeSnap = timerTime

    let quesCont = document.createElement('div')
    quesCont.classList.add('question-container')
    quesCont.innerHTML = `
        <div class="top-info">
            <div class="question-number">
                <p>Question: ${gameInfo.currentQuestion + 1}/${gameInfo.questions.length}</p>
            </div>
            <div class="question-text">
                <h1>${current.question.text}</h1>
            </div>
        </div>
        <div class="middle-info"></div>
        <div class="bottom-info">
            <div class="timer">${timerTime}</div>
            <div class="progress-bar"></div>
        </div>`

    main.appendChild(quesCont)

    let questionsDiv = document.querySelector('.middle-info')
    for(let i = 0; i < current.question.answer.length; i++){
        let question = document.createElement('div')
        question.classList.add('question-query', 'clickable', `quest-${i}`)
        question.innerHTML = `${current.question.answer[i]}`
        questionsDiv.appendChild(question)
        if(i % 2 == 0){
            question.style.transform = 'translateX(-100vw)'
        }else{
            question.style.transform = 'translateX(100vw)'
        }
    }

    doPBTimer("start", showTime)

    setTimeout(() => {
        //MOVE QUESTION, PROGRESS BAR AND TIMER
        document.querySelector('.question-number').style.transform = `translateY(-200px)`
        document.querySelector('.question-text').style.transform = `translateY(-20px)`
        document.querySelector('.timer').style.transform = `translateX(0px)`
        document.querySelector('.progress-bar').style.transform = `skew(-15deg)`
        //MOVE ANSWERS
        document.querySelector('.middle-info').querySelectorAll('.clickable').forEach(element => {
            element.style.transform = 'translateX(0px)'
        });
        //FUNCTIONS
        doPBTimer('countdown')
        doTimerTick()
    }, showTime)

    document.querySelector('.question-container').addEventListener('click', (event) => {
        if(event.target.classList[1] == "clickable"){
            console.log(event.target.classList[2].split('-')[1])
            checkQuestion(event.target.classList[2].split('quest-')[1])
        }
    })
}

const checkQuestion = (data) => {
    let current = gameInfo.questions[gameInfo.currentQuestion]
    if(data !== false){
        clearInterval(timerInterval)
    }
    let correctAns
    for(let i = 0; i < current.question.answer.length; i++){
        if(current.question.answer[i] == current.question.correct){
            correctAns = i
        }
    }
    for(let i = 0; i < current.question.answer.length; i++){
        let div = document.querySelector('.middle-info').children[i]
        div.classList.toggle('clickable')
        if(i == correctAns){
            // div.style.filter = `hue-rotate(90deg)`
            div.style.background = `rgb(0, 128, 0)`
        }else{
            div.style.filter = `grayscale(0) brightness(0.75)`
            div.style.background = `rgb(128, 0, 0)`
        }
    }
    scoreCalc(correctAns, current, data)
    let nextQuestion = document.createElement('button')
    nextQuestion.id = `next-question`
    nextQuestion.innerHTML = `NEXT QUESTION`
    document.querySelector('.question-container').appendChild(nextQuestion)
    gameInfo.currentQuestion++
    document.querySelector('#next-question').addEventListener('click', (event) => {
        createQuestion()
    })
}

const doPBTimer = (type, time) => {
    let progressBarDiv = document.querySelector('.progress-bar')
    if(type == "start"){
        let randomNum = [`${doRandomNum(50, 200)}, 0, 0`, `0, ${doRandomNum(50, 200)}, 0`]
        progressBarDiv.style.background = `linear-gradient(90deg,rgba(${randomNum[0]}, 1) 0%, rgba(${randomNum[0]}) 50%, rgba(${randomNum[1]}, 1) 50%, rgba(${randomNum[1]}, 1) 100%)`
        progressBarDiv.style.backgroundSize = `200% 100%`
        setTimeout(() => {
            progressBarDiv.style.transition = `transform 0.25s, background-position ${time / 1000}s linear`
            progressBarDiv.style.backgroundPosition = `100% 0%`
        }, 10)
    }else if(type == "countdown"){
        progressBarDiv.style.transition = `transform 0.25s, background-position 0.5s`
    }
}

const doTimer = () => {
    let current = gameInfo.questions[gameInfo.currentQuestion].difficulty
    let timer = 10
    if(current == "hard"){
        timerTime = timer * 5
    }else if(current == "normal"){
        timerTime = timer * 3
    }else{
        timerTime = timer * 2
    }
}

const doTimerTick = () => {
    timerInterval = setInterval(() => {
        let currentPos = 100 - ((timerTimeSnap - timerTime) * (100 / timerTimeSnap))
        document.querySelector('.timer').textContent = `${timerTime}`
        document.querySelector('.progress-bar').style.backgroundPosition = `${currentPos}% 0%`
        if(timerTime == 0){
            clearInterval(timerInterval)
            showQAnswers(false)
            gameInfo.currentQuestion++
        }
        timerTime--
    }, 1000)
}

const scoreCalc = (correct, current, clk_qst) => {
    let audio
    if(correct == clk_qst && clk_qst !== false){
        let score
        let multiplier
        if(current.difficulty == "hard"){
            multiplier = 3
        }else if(current.difficulty == "normal"){
            multiplier = 2
        }else{
            multiplier = 1
        }
        scoreTrack.streak++
        if(scoreTrack.lngstS < scoreTrack.streak){
            scoreTrack.lngstS = scoreTrack.streak
        }
        score = 50 * multiplier + (10 * scoreTrack.streak) + (10 * timerTime)
        scoreTrack.answeredQ.push(score)
        audio = new Audio('files/sounds/base/correct.mp3')
    }else{
        scoreTrack.streak = 0
        scoreTrack.answeredQ.push(0)
        audio = new Audio('files/sounds/base/incorrect.mp3')
    }
    audio.play()
}

const showLdrBrd = () => {
    const main = document.querySelector('main')
}

const createEndScreen = () => {
    let totalScore = 0
    let questionsA = 0
    for(let i = 0; i < scoreTrack.answeredQ.length; i++){
        totalScore += scoreTrack.answeredQ[i]
        if(scoreTrack.answeredQ[i] !== 0){
            questionsA++
        }
    }
    document.querySelector('main').innerHTML = `
    <h2 class="score-show"></h2>
    <h3>Streak: ${scoreTrack.streak}, Longest Streak:(${scoreTrack.lngstS})</h3>
    <h5>Total Questions Answered: ${questionsA}</h5>`
    document.querySelector('footer').innerHTML = ``
    if(questionsA == scoreTrack.answeredQ.length){
        document.querySelector('.score-show').innerHTML = `Total Score: ${totalScore}, A PERFECT SCORE`
    }else if(questionsA == 0){
        document.querySelector('.score-show').innerHTML = `Total Score: ${totalScore}, NOOB`
    }else{
        document.querySelector('.score-show').innerHTML = `Total Score: ${totalScore}`
    }
}

createRoom()

document.querySelector('#create-api-text').addEventListener('click', (event) => {
    createQuestions()
})

document.querySelector('#number-questions').addEventListener('input', (event) => {
    event.target.value = limitInput(event.target.value)
})
