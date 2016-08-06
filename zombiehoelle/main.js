var welle = 1
var verteidigung = 1
var spieleranzahl = 1
var wasser = 3

var inventar = [
    {name: "Brett", label: "ein Brett", anzahl: 0},
    {name: "Stein", label: "einen Stein", anzahl: 0},
    {name: "Sand", label: "Sand", anzahl: 0}
]

var techtree = [
    {name: "Pflock", label: "einen Pflock", permanent: false, verteidigung: 1, baukosten: [{name: "Brett", anzahl: 1}]},
    {name: "Steinmauer", label: "eine Steinmauer", permanent: false, verteidigung: 10, baukosten: [{name: "Stein", anzahl: 10}]},
    {name: "Bretterkreuz", label: "ein Bretterkreuz", permanent: false, verteidigung: 10, baukosten: [{name: "Brett", anzahl: 3}]},
    {name: "Brunnen", label: "einen Brunnen", permanent: true, baukosten: [{name: "Brett", anzahl: 20}, {name: "Stein", anzahl: 10}]},
    {name: "Werkstatt", label: "die Werkstatt", permanent: true, baukosten: [{name: "Brett", anzahl: 5}, {name: "Stein", anzahl: 7}]}
]

var buildings = [
    
]

var map = []
for (var x = 0; x < 16; x++) {
    map[x] = []
    for (var i = 0; i < 16; i++) {
        map[x][i] = 0
    }
}

function startTimer(duration) {
    var timer = 60 * 2, minutes, seconds
    mytimer = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10)

        minutes = minutes < 10 ? "0" + minutes : minutes
        seconds = seconds < 10 ? "0" + seconds : seconds

        $('#timer').text("-" + minutes + ":" + seconds)

        if (--timer < 0) {
            clearInterval(mytimer)
            setTimeout(function() {
                ZombieAttack()
                startTimer(60 * 2)
            }, 1000)
        }
    }, 1000);
}

jQuery(function ($) {
    var fiveMinutes = 60 * 5, display = $('#timer')
    startTimer(fiveMinutes)
});

function ZombieAttack() {
    playAudio("https://www.youtube.com/audiolibrary_download?vid=bfb60515d518694b")
    var angriffstärke = randomNumberGen(5 + welle, (10 + welle) * spieleranzahl)
    if (angriffstärke >= verteidigung) {
        $("#messages").empty()
        message("Die Zombies greifen mit " + angriffstärke + " Stärke an und du hast nur " + verteidigung + ". Jetzt entscheidet der Nahkampf: Überlebender gegen Zombie!")
        verteidigung = 1
        if (randomNumberGen(0, welle) == 1) {
            gameover()
        } else {
            message("Du hast den Angriff mit Glück überlebt.")
            welle = welle + 1
            renderWelle()
        }
    } else {
        welle = welle + 1
        renderWelle()
        $("#messages").empty()
        verteidigung = verteidigung - Math.round(angriffstärke / randomNumberGen(2, 5))
        message("Der Zombieangriff wurde abgewehrt, aber deine Verteidigung hat Schaden erlitten. Du hast noch " + verteidigung + " Punkte.")
    }
}

function gameover() {
    playAudio("https://www.youtube.com/audiolibrary_download?vid=26fa4912b03fa459")
    clearInterval(mytimer)
    $("#frame").remove()
    $("body").addClass("gameover")
    $("body").html("<div style='text-align: center; font-size:300%;'><b>Zombies fressen dein Gehirn.</b><br/>Du bist tot!</div>")
}

function randomNumberGen(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function message(nachricht) {
    $("#messages").append("<p>" + nachricht + "<p/>")
    $("#messages").animate({
        scrollTop: 1000
    }, 500);
}

function checkbuilder() {
    var canBuild = false
    $("#builder").empty()
    for (var bb = 0; bb < techtree.length; bb++) {
        for (var kk = 0; kk < techtree[bb].baukosten.length; kk++) {
            for (var cc = 0; cc < inventar.length; cc++) {
                if (techtree[bb].baukosten[kk].name == inventar[cc].name && inventar[cc].anzahl >= techtree[bb].baukosten[kk].anzahl) {
                    canBuild = true
                } else {
                    canBuild = false
                }
                if (canBuild == true && cc == techtree[bb].baukosten.length - 1) {
                    $("#builder").append("<div class='build' onclick='build(\""+ techtree[bb].name + "\")'>" + techtree[bb].name + " bauen</div>")    
                }
            }
        }
    }
}

function build(building) {
    var bauKostenOK = false
    var tempVerteidigung = 0
    var tempName = ""
    for (var t = 0; t < techtree.length; t++) {
        if (building == techtree[t].name && techtree[t].permanent == false) {
            for (var kk = 0; kk < techtree[t].baukosten.length; kk++) {
                for (var inv = 0; inv < inventar.length; inv++) {
                    if (inventar[inv].name == techtree[t].baukosten[kk].name) {
                        bauKostenOK = true
                        tempVerteidigung = techtree[t].verteidigung
                        tempName = techtree[t].name
                        inventar[inv].anzahl = inventar[inv].anzahl - techtree[t].baukosten[kk].anzahl
                    }
                }
            }
        } else if (building == techtree[t].name && techtree[t].permanent == true) {
          if (map[x][y] == 0) {
              for (var kk = 0; kk < techtree[t].baukosten.length; kk++) {
                  for (var inv = 0; inv < inventar.length; inv++) {
                      if (inventar[inv].name == techtree[t].baukosten[kk].name && inventar[inv].anzahl >= techtree[t].baukosten[kk].anzahl) {
                          inventar[inv].anzahl = inventar[inv].anzahl - techtree[t].baukosten[kk].anzahl
                          map[x][y] = techtree[t].name
                          tempName = techtree[t].name
                          bauKostenOK = true
                      }
                  }
              }
          } else {
              message("Auf diesem Platz steht bereits etwas.")
          }
        }
    }
    if (bauKostenOK) {
        verteidigung = verteidigung + tempVerteidigung
        message(tempName + " wurde gebaut.")     
    }
    checkbuilder()
    renderVerteidigung()
}

function move(direction) {
    switch (direction) {
        case "top":
            if (y < 15) {
                y = y + 1
                wasser = wasser -1
                dropStuff()
            } else {
                  message("Hier geht es nicht weiter")
              }
            break
        case "down":
            if (y > 0) {
                y = y - 1
                wasser = wasser -1
                dropStuff()
            } else {
                  message("Hier geht es nicht weiter")
              }
            break
        case "right":
            if (x < 15) {
                x = x + 1
                wasser = wasser -1
                dropStuff()
            } else {
                 message("Hier geht es nicht weiter")
             }
            break
        case "left":
            if (x > 0) {
                x = x - 1
                wasser = wasser -1
                dropStuff()
            } else {
                message("Hier geht es nicht weiter")
            }
            break
    }
    renderPosition()
    checkActions()
    renderWater()
}

function renderPosition() {
    if (map[x][y] == 0) {
        $("#currentPosition").text("")
    } else {
        $("#currentPosition").text(map[x][y])
    }
    if (map[x][y] == "Brunnen") {
        wasser = wasser + randomNumberGen(3, 5)
        message("Du hast dir Wasser aus dem Brunnen geholt.")
    }
    if (map[x][y] == "Werkstatt") {
        
    }
    $("#cords").text("X: " + x + " Y: " + y)
}

function startPosition() {
    playAudioBackground("https://www.youtube.com/audiolibrary_download?vid=ebcc847570aeee65")
    x = randomNumberGen(0, 15)
    y = randomNumberGen(0, 15)
    map[x][y] = "Brunnen"
    message("Du bist an einem Brunnen. In zwei Minuten greifen die Zombies an. Du musst Material suchen, um dich zu verteidigen! Baue Verteidigungskonstruktionen.")
}

function dropStuff() {
    if (map[x][y] == 0) {
        var random = randomNumberGen(0, 1)
        switch (random) {
            case 0:
                map[x][y] = "Brett"
                break
            case 1:
                map[x][y] = "Stein"
                break
        }
    }
}

function checkActions() {
    $("#actions").html("")
    for (var inv = 0; inv < inventar.length; inv++) {
        if (map[x][y] == inventar[inv].name) {
            $("#actions").html("<div class='pick' onclick='take(\""+ inventar[inv].name + "\")'>aufnehmen</div>")
        }
    }
}

function take(item) {
    for (var inv = 0; inv < inventar.length; inv++) {
        if (map[x][y] == inventar[inv].name && item == inventar[inv].name) {
            inventar[inv].anzahl++
            message(inventar[inv].anzahl +" "+ inventar[inv].name + " im Inventar.")
            $("#actions").empty()
            $("#currentPosition").empty()
            map[x][y] = 0
            checkbuilder()
        }
    }
}
function playAudio(file) {
    var paudio = new Audio(file);
    paudio.volume = 0.9;
    paudio.play();
}
function playAudioBackground(file) {
    var baudio = new Audio(file);
    baudio.volume = 0.5;
    baudio.play();
    baudio.loop = true;
}
function renderWelle() {
    $("#welle").text(welle + ". Welle")
}
function renderVerteidigung() {
    $("#verteidigung").text(verteidigung + " Verteidigung")
}

function renderWater() {
    if (wasser < 3) {
        message("Achtung! Dein Wasser wird knapp.")
    }
    if (wasser <= 0) {
        gameover()
    }
    $("#wasser").text(wasser + " Wasser")
}

startPosition()
renderPosition()
renderVerteidigung()
renderWater()
renderWelle()