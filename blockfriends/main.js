var moods = ["normal", "aufgeregt", "erschöpft"]

var Player = class {
    constructor(playerName, id) {
        this.id = id
        this.moving = false
        this.name = playerName
        this.leben = 100
        this.hunger = 60
        this.liebe = 90
        this.mood = moods[0]
        this.wach = 100
        this.blinzeln = function () {
            $(".augenP1").css("fill", "black")
        }
        this.idle = function() {
            this.autoMoving = setInterval(actionTimer, 1000)
        }
        this.stopidle = function() {
            clearInterval(this.autoMoving)
        }
        this.init = function () {
            this.idle()
            $("#player" + id).on( "click", function () {
                // console.log("click")
                movePlayer(id, "hoch", 50, 500)
            })
        }
        this.renderMe = renderPlayer(this.id)
    }
}

function init() {
    // singleplayer    
    // insert player 1
    Player1 = new Player("Alex", 1);
    Player1.init()

    // load player 1 data
    loadPlayer1()

    // autosave Player1 5 sek
    setInterval(savePlayer1, 5000)
    setInterval(reduziertWerte, 30000)

    // berechnet afk zeit
    var now = new Date
    afkTimer(now.getTime())

    // multiplayer
    updateStats()
}

function loadPlayer1() {
    if (parseInt(localStorage.getItem("Player1.id")) == 1) {
        Player1.id = 1;
        Player1.name = localStorage.getItem("Player1.name")
        Player1.leben = parseInt(localStorage.getItem("Player1.leben"))
        Player1.hunger = parseInt(localStorage.getItem("Player1.hunger"))
        Player1.liebe = parseInt(localStorage.getItem("Player1.liebe"))
        Player1.mood = localStorage.getItem("Player1.mood")
        updateStats()
    }
}


// bewegung tut gut!
function movePlayer(id, richtung, schritte, dauer) {
    // console.log("move")
    if (dauer == "") {
        dauer = 500
    }
    if (Player1.moving != true) {
        var cords = $("#player"+ id).offset()        
        if (cords.left < window.innerWidth - 100 && cords.left > 100) {
            Player1.moving = true 
            if (richtung == "links") {
                $("#player"+ id).animate({
                    left: "+=" + schritte
                }, dauer, function() {
                    Player1.moving = false
                });
            }
            if (richtung == "rechts") {
                $("#player"+ id).animate({
                    left: "-=" + schritte
                }, dauer, function() {
                    Player1.moving = false
                });
            }
        }

        if (richtung == "runter") {
            $("#player"+ id).animate({
                bottom: "-=" + schritte
            }, dauer, function() {
                Player1.moving = false
            });
        }
        if (richtung == "hoch") {
            $("#player"+ id).animate({
                bottom: "+=" + schritte
            }, dauer, function() {     
                Player1.moving = false           
                movePlayer(id, "runter", schritte, 250)
            });
            playAudio("https://www.youtube.com/audiolibrary_download?vid=2d671c3f7880968e")
        }
    }
}

// HUNGGGEERRR!!! Und so
function reduziertWerte() {
    if (randomNumberGen(0,1) == 0) {
        if (Player1.hunger - 1 >= 0) {
            Player1.hunger = Player1.hunger - 1
            updateStats()
        }
    }
}

function savePlayer1() {
    try {
        var now = new Date
        localStorage.setItem("Player1.id", Player1.id)
        localStorage.setItem("Player1.name", Player1.name)
        localStorage.setItem("Player1.leben", Player1.leben)
        localStorage.setItem("Player1.hunger", Player1.hunger)
        localStorage.setItem("Player1.liebe", Player1.liebe)
        localStorage.setItem("Player1.mood", Player1.mood)

        var lastplayed = new Date
        localStorage.setItem("lastplayed", lastplayed.getTime())
        console.log("...autosaved")
     } catch(err) {
        console.log(err)
    }    
}

 
// random timer
function actionTimer() {
    var random = randomNumberGen(0,2)
    var schritte = randomNumberGen(0,25)
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
    // bedürfnisse steigen
    
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
    } catch(err) {
        console.log(err)
    }
    
}

// afkTimer
function afkTimer () {
    var now = new Date
    var diff = now.getTime() - parseInt(localStorage.getItem("lastplayed")) 
    if (Player1.hunger - Math.round(diff / 10000) >= 0) {
        Player1.hunger = Player1.hunger - Math.round(diff / 10000)
        updateStats()
    }
}

function updateStats() {  
    $("#p1hunger").text(Player1.hunger)
    $("#p1leben").text(Player1.leben)
}

// spielt soundeffekte ab
function playAudio(file) {
    var paudio = new Audio(file);
    paudio.volume = 0.9;
    paudio.play();
}


// füttern hunger++
function futter(id) {
    // futter animation
    // set values
    if (Player1.hunger < 100) {
        Player1.hunger = parseInt(Player1.hunger) + 20
    }
    updateStats()
}

init()