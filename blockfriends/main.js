var Player = class {
    constructor(playerName) {
        this.name = playerName;
        this.leben = 100;
        this.hunger = 100;
        this.liebe = 90;
        this.mood = moods[0];
        this.wach = 100;
    }
}

var moods = ["normal", "aufgeregt", "erschöpft"]

function init() {
    // singleplayer
    // insert player 1
    Player1 = new Player("Alex");

    // load player 1 data
    loadPlayer1()

    // autosave Player1 10 sek

    // OMG GRAFIK!
    renderPlayer(Player1)

    // multiplayer
}

function loadPlayer1() {
    try {
        Player1.id = 1;
        Player1.name = localStorage.getItem(Player1.name)
        Player1.leben = localStorage.getItem(Player1.leben)
        Player1.hunger = localStorage.getItem(Player1.hunger)
        Player1.liebe = localStorage.getItem(Player1.liebe)
        Player1.mood = localStorage.getItem(Player1.mood)
    } catch(err) {
        console.log(err)
    }
}

function savePlayer1() {
    try {
        localStorage.setItem(Player1.name, Player1.name)
        localStorage.setItem(Player1.leben, Player1.leben)
        localStorage.setItem(Player1.hunger, Player1.hunger)
        localStorage.setItem(Player1.liebe, Player1.liebe)
        localStorage.setItem(Player1.mood, Player1.mood)
     } catch(err) {
        console.log(err)
    }    
}

 
// random timer
function actionTimer() {
   


}

function renderPlayer(player) {
    try {
        // erschaffe leben
        $("#main").append("<div id='"+ player.id + "'></div>")

        // render player

    } catch(err) {
        console.log(err)
    }
    
}

// afk zeit berechnen
function afkTimer() {
    var lastplayed = localStorage.getItem(lastplayed)

    
}
// hunger

// trinken

// liebe

init()