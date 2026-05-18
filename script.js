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

let api = 'https://opentdb.com/api_config.php'
let difficulty = "Hard"
let categories = "Entertainment: Video Games"
let typeOfAnswers = "Multiple Choice"