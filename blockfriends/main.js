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
            this.autoMoving = setTimeout(actionTimer, 1000)
        }
        this.stopidle = function() {
            clearTimeout(this.autoMoving)
            clearTimeout(actionTimerTimeout)
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


    savePlayer1()

    reduziertWerte()

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
    if (!id || !richtung || !schritte) {
        return;
    }
    if (dauer == "") {
        dauer = 500
    }
    if (Player1.moving != true) {
        var cords = $("#player"+ id).offset()
        Player1.moving = true 
        if (cords.left < window.innerWidth * 0.6 && richtung == "links") {
            $("#player"+ id).animate({
                left: "+=" + schritte,
                right: "-=" + schritte,
            }, dauer, function() {
                Player1.moving = false
            });
        } else if (cords.left > window.innerWidth * 0.3 && richtung == "rechts") {
            $("#player"+ id).animate({
                left: "-=" + schritte,
                right: "+=" + schritte,
            }, dauer, function() {
                Player1.moving = false
            });
        } else {
            Player1.moving = false
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
    setTimeout(reduziertWerte, 1000)
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

        setTimeout(savePlayer1, 5000)
     } catch(err) {
        console.log(err)
    }    
}

 
// random timer
function actionTimer() {
    var random = randomNumberGen(0, 3)
    var schritte = randomNumberGen(0, 100)
    var dauer = randomNumberGen(200, 500)
    switch (random) {
        case 0:
            // nichts
            break
        case 1:
            // zufällig gehen
            movePlayer(1, "links", schritte, dauer)
            break
        case 2:
            // zufällig gehen
            movePlayer(1, "rechts", schritte, dauer)
            break
    }
    actionTimerTimeout = setTimeout(actionTimer, randomNumberGen(2000, 3000))
}

function randomNumberGen(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function renderPlayer(id) {
    try {
        // render player
        $("#main").append('<div id="player'+ id +'" style="left:30%">'+
            '<svg width="150" height="150" viewBox="0 0 150 150">'+
                '<rect width="100" height="100" x="25" y="50" style="fill: #000;"/>'+
                '<circle id="augeL" class="augenP1" cx="60" cy="90" r="5" stroke-width="3" fill="white" />'+
                '<circle id="augeR" class="augenP1" cx="90" cy="90" r="5" stroke-width="3" fill="white" />'+
                //'<ellipse cx="25" cy="75" rx="10" ry="20" class="ohren" style="fill: #000000;stroke-width:2;transform: rotate(-30deg);transform-origin: 50% 50%;"></ellipse>'+
                //'<ellipse cx="125" cy="80" rx="10" ry="20" class="ohren" style="fill: #000000;stroke-width:2;transform-origin: 50% 50%;transform: rotate(30deg);"></ellipse>'+
                '<path id="mund" d="M 60 125 q 25 30 30 0" stroke="white" stroke-width="5" fill="none"></path>'+
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
    if (Player1.hunger - Math.round(diff / 1000000) >= 0) {
        console.log("hunger vorher " + Player1.hunger)
        console.log("diff: " + diff)        
        Player1.hunger = Player1.hunger - Math.round(diff / 1000000)
        console.log("hunger jetzt: " + Player1.hunger)
        updateStats()
    }
}

function updateStats() {  
    $("#p1hunger").text(Player1.hunger)
    $("#p1futterButton").css("background", "linear-gradient('to right, black "+ Player1.hunger +"%, white "+ Player1.hunger + 2 +"')")
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
    // 

    // set values
    if (Player1.hunger < 100) {
        Player1.hunger = parseInt(Player1.hunger) + 20
    }
    updateStats()
}

init()