var Player = class {
    constructor(playerName, id) {
        this.id = id
        this.moving = false
        this.name = playerName
        this.leben = 100
        this.hunger = 100
        this.liebe = 90
        this.mood = moods[0]
        this.wach = 100
        this.blinzeln = function () {
            $(".augenP1").css("fill", "black")
        }
        this.idle = function() {
            this.autoMoving = setInterval(actionTimer, 1000)
        }
        this.stop = function() {
            clearInterval(this.autoMoving)
        }
        this.renderMe = renderPlayer(this.id)
    }
}

var moods = ["normal", "aufgeregt", "erschöpft"]

function init() {
    // singleplayer    
    // insert player 1
    Player1 = new Player("Alex", 1);
    Player1.idle()

    // load player 1 data
    loadPlayer1()

    // autosave Player1 10 sek

    // OMG GRAFIK!
    

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


// bewegung tut gut!
function movePlayer(id, richtung, schritte, dauer) {
    if (dauer == "") {
        dauer = 1000
    }
    if (richtung == "links") {
        $("#player"+ id).animate({
            left: "+=" + schritte
        }, dauer, function() {
            moving = false
        });
    }
    if (richtung == "rechts") {
        $("#player"+ id).animate({
            left: "-=" + schritte
        }, dauer, function() {
            
        });
    }
    if (richtung == "runter") {
        $("#player"+ id).animate({
            bottom: "-=" + schritte
        }, dauer, function() {
            
        });
    }
    if (richtung == "hoch") {
        $("#player"+ id).animate({
            bottom: "+=" + schritte
        }, dauer, function() {
           movePlayer(id, "runter", schritte, 500)
        });
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
    var random = randomNumberGen(0,5)
    var schritte = randomNumberGen(0,10)
    switch (random) {
        case 0:
            // nichts
            break
        case 1:
            // zufällig gehen
            movePlayer(1, "links", schritte)
            break
        case 2:
            // zufällig gehen
            movePlayer(1, "rechts", schritte)
            break
    }
}

function randomNumberGen(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function renderPlayer(id) {
    try {
        // render player
        $("#main").append('<div id="player'+ id +'" style="left:30%">'+
            '<svg width="100" height="100">'+
                '<rect width="100" height="100" style="fill: #000;"/>'+
                '<circle id="augeL" class="augenP1" cx="33" cy="30" r="5" stroke-width="3" fill="white" />'+
                '<circle id="augeR" class="augenP1" cx="66" cy="30" r="5" stroke-width="3" fill="white" />'+
            '</svg>'+
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