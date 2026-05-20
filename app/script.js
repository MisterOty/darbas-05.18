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

// BUG 1#:
// Some categories doesnt have much or any boolean questions

let api = 'https://opentdb.com/api_config.php'

let minMaxQuestions = [1, 50]

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

//API FETCHING FUNCTION

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

const createSettings = () => {
    const main = document.querySelector('main')
    let createDiv = document.createElement('div')
    createDiv.classList.add('questions-creator')
    let titles = ["Number of Questions", "Categories:", "Difficulty:", "Select Type:"]
    let id = ["number-questions", "category", "difficulty", "type"]
    let childDiv
    let text
    for(let o = 0; o < titles.length; o++){
        text = document.createElement('p')
        text.innerHTML = `${titles[o]}`
        if(o == 0){
            childDiv = document.createElement('input')
            childDiv.id = id[o]
            childDiv.type = `number`
            childDiv.value = `${minMaxQuestions[0]}`
        }else{
            childDiv = document.createElement('select')
        }
        if(o == 1){
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
        }else if(o == 2){
            childDiv = document.createElement('select')
            childDiv.id = id[o]
            for(let i = 0; i < difficulties.length; i++){
                childDiv.innerHTML += `<option value="${difficulties[i][1]}">${difficulties[i][0]}</option>`
            }
            createDiv.appendChild(childDiv)
        }else if(o == 3){
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
    let text
    for(let i = 0; i < id.length; i++){
        if(i == 0){
            text = document.querySelector(`#${id[i]}`)
        }else{
            text = document.querySelector(`#${id[i]}`).selectedOptions[0]
        }
        if(text.value !== "0"){
            link += `&${suffix[i]}=${text.value}`
        }
    }
    let output = await getAPIInfo(link)
    console.log(output)
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

createSettings()

document.querySelector('#create-api-text').addEventListener('click', (event) => {
    createQuestions()
})

document.querySelector('#number-questions').addEventListener('input', (event) => {
    event.target.value = limitInput(event.target.value)
})



// const socket = new WebSocket('ws://localhost:8080')

// socket.onmessage = ({data}) => {
//     console.log('Message from server: ', data)
// }

// document.querySelector('button').onClick = () => {
//     socket.send('hello')
// }

// const sendMessage = () => {
//     console.log('button clicked')
// }