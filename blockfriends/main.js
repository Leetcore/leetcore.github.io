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
    renderPlayer(1)
    

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

// move X
function jump() {               
  if (!jumping) {
    jumping = true;
    setTimeout(land, 500);
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

function renderPlayer(id) {
    try {
        // render player
        $("#main").append('<div id="player'+ id +'" style="left:30%">'+
            '<svg width="100" height="100"><rect width="250" height="180" style="fill: #000"/></svf>'+
        '</div>')

        // 
    } catch(err) {
        console.log(err)
    }
    
}

// afk zeit berechnen
function afkTimer() {
    var lastplayed = localStorage.getItem(lastplayed)

    
}

function redraw() {


}

// hunger

// trinken

// liebe

init()