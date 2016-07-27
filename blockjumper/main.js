var hardcore = 10
var gameover = false
var stayTimer
var gameSTARTED = false

var Player = class {
    constructor(playerName, id) {
        this.id = id
        this.moving = false
        this.name = playerName
        this.idle = function() {
            this.autoMoving = setTimeout(actionTimer, 200)
        }
        this.stopidle = function() {
            clearTimeout(this.autoMoving)
            clearTimeout(actionTimerTimeout)
        }
        this.init = function () {
            this.idle()
            clickable(1)
        }
        this.renderMe = renderPlayer(this.id)
    }
}

function init() {
    // singleplayer    
    // insert player 1
    Player1 = new Player("Alex", 1);
    Player1.init()
}

function clickable (id) {
        $("#player" + id).on( "click", function () {        
            // console.log("click")
            gameSTARTED = true
            if (!gameover) {
                movePlayer(id, "hoch", 10, 300)
                $("#player" + id).off()
                $("#player" + id).css("cursor", "progress");
                $("#player" + id + " svg rect").css("fill", "#476b4b");
                clickme = setTimeout(function() {clickable(id); $("#player" + id).css("cursor", "pointer")}, 250)
            }
            if (gameover) {
                looser()
            }
        })
}


// bewegung tut gut!
function movePlayer(id, richtung, schritte, dauer) {
    if (!gameover) {
        var cords = $("#player"+ id).offset()

        Player1.moving = true

        if (richtung == "links") {
            $("#player"+ id).animate({
                left: "-=" + schritte               
            }, {queue: false}, dauer, function() {
                Player1.moving = false
            });
        } else if (richtung == "rechts") {
            $("#player"+ id).animate({                
                left: "+=" + schritte
            }, {queue: false}, dauer, function() {
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
                    if ($("#player"+ id).offset().top >= 175) {
                        looser()
                    } else {
                        $("#punkte").text(parseInt($("#punkte").text()) + 1)
                    }
                }
            )
        }

        if (richtung == "hoch") {                        
            if (!gameover) {
                playAudio("https://www.youtube.com/audiolibrary_download?vid=f5b3c23c023f2f44")
                $("#player"+ id).animate({
                    queue: false,
                    bottom: "+=" + schritte
                }, dauer, function() {     
                    Player1.moving = false
                    stayTimer = setTimeout(function() {
                        movePlayer(id, "runter", schritte, 300)
                    }, 1000);                    
                });            
            }
        }
    }
}

// VERLORREEEEN!
function looser() {
    gameover = true
    clickme.clearTimeout
    actionTimerTimeout.clearTimeout
    stayTimer.clearTimeout
    Player1.stopidle()

    playAudio("https://www.youtube.com/audiolibrary_download?vid=13321fdd50ae3ee6")
    $("#main").text("VERLOREN! VERLOREN! VERLOREN!")
    $("#main").css("background-color", "#cc2b2b")
    $("#player1").remove()
}
 
// random timer
function actionTimer() {
    if (!gameover) {
        var random = randomNumberGen(0, 1)
        var schritte = randomNumberGen(10 + hardcore, 20 + hardcore)
        var dauer = randomNumberGen(600 - hardcore, 900 - hardcore)
        var cords = $("#player1").offset()

        //console.log("left: "+ cords.left)

        switch (random) {
            case 0:
                if (cords.left > 500) {                                    
                    // zufällig gehen
                    movePlayer(1, "links", schritte, dauer)
                } else {
                    movePlayer(1, "rechts", schritte, dauer)
                }
                if (gameSTARTED) {
                    if (hardcore <= 250) {hardcore = hardcore + 5}
                }    
                break            
            case 1:
                if (cords.left < window.innerWidth - 500) {
                    
                    // zufällig gehen
                    movePlayer(1, "rechts", schritte, dauer)
                } else {
                    movePlayer(1, "links", schritte, dauer)
                }   
                if (gameSTARTED) {
                    if (hardcore <= 250) {hardcore = hardcore + 5}
                }            
                break
        }
        actionTimerTimeout = setTimeout(actionTimer, randomNumberGen(600 - hardcore, 1200 - hardcore))
    }
}

function randomNumberGen(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function renderPlayer(id) {
    try {
        // render player
        $("#main").append('<div id="player'+ id +'" style="left:30%">'+
            '<svg width="150" height="150" viewBox="0 0 150 150">'+
                '<rect id="body" width="100" height="100" x="25" y="50" style="fill: #000;"/>'+
                //'<circle id="augeL" class="augenP1" cx="60" cy="90" r="5" stroke-width="3" fill="white" />'+
                //'<circle id="augeR" class="augenP1" cx="90" cy="90" r="5" stroke-width="3" fill="white" />'+
                //'<ellipse cx="25" cy="75" rx="10" ry="20" class="ohren" style="fill: #000000;stroke-width:2;transform: rotate(-30deg);transform-origin: 50% 50%;"></ellipse>'+
                //'<ellipse cx="125" cy="80" rx="10" ry="20" class="ohren" style="fill: #000000;stroke-width:2;transform-origin: 50% 50%;transform: rotate(30deg);"></ellipse>'+
                '<path id="mund" d="M 60 125 q 25 30 30 0" stroke="white" stroke-width="5" fill="none"></path>'+
                '<path id="frisur" d="M 10 35 C 155 40, 120 50, 60 50 S 90 50, 100 70" stroke="white" stroke-width="5" fill="transparent"></path>'+
            '</svg>'+
            '<div id="augeL" class="augenP1"></div>'+
            '<div id="augeR" class="augenP1"></div>'+
        '</div>')
    } catch(err) {
        console.log(err)
    }
}


// spielt soundeffekte ab
function playAudio(file) {
    var paudio = new Audio(file);
    paudio.volume = 0.9;
    paudio.play();
}

init()