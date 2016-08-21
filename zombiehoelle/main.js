var welle = 1
var verteidigung = 1
var spieleranzahl = 1
var wasser = 15
var angriffstärke = 2
isGameover = false

var inventar = [
    {name: "Brett", plural: "Bretter", anzahl: 3},
    {name: "Stein", plural: "Steine", anzahl: 0},
    {name: "Stock", plural: "Stöcke", anzahl: 0},
    {name: "Sand", plural: "Sand", anzahl: 0},
    {name: "Seil", plural: "Seile", anzahl: 0},
    {name: "Metall", plural: "Metalle", anzahl: 0},
    {name: "Schaufel", plural: "Schaufeln", anzahl: 0},
    {name: "Pistole", plural: "Pistolen", anzahl: 0, verteidigung: 15},
    {name: "Schwert", plural: "Schwerter", anzahl: 0, verteidigung: 10},
    {name: "Talisman", plural: "Talismane", anzahl: 0},
    {name: "Glas", plural: "Gläser", anzahl: 0},
    {name: "TNT", plural: "TNT", anzahl: 0},
    {name: "Lupe", plural: "Lupen", anzahl: 0},
    {name: "Wasserkanister", plural: "Wasserkanister", anzahl: 0, wasser: 10},
    {name: "Benzin", plural: "Benzin", anzahl: 0},
    {name: "Zaubertrank", plural: "Zaubertränke", anzahl: 0, verteidigung: 80},
    {name: "Stroh", plural: "Stroh", anzahl: 0},
    {name: "Kerze", plural: "Kerze", anzahl: 0},
    {name: "Säge", plural: "Sägen", anzahl: 0}
]

var techtree = [
    {name: "Pflock", permanent: false, verteidigung: 1, baukosten: [{name: "Brett", anzahl: 3}]},
    {name: "Hammer", permanent: false, verteidigung: 3, baukosten: [{name: "Stock", anzahl: 1}, {name: "Stein", anzahl: 1}, {name: "Seil", anzahl: 1}]},
    {name: "Graben", permanent: false, verteidigung: 30, baukosten: [{name: "Schaufel", anzahl: 3}, {name: "Brett", anzahl: 3}, {name: "Stein", anzahl: 3}]},
    {name: "Steinmauer", permanent: false, verteidigung: 10, baukosten: [{name: "Stein", anzahl: 10}]},
    {name: "Talis Auge", permanent: false, verteidigung: 50, baukosten: [{name: "Stock", anzahl: 1}, {name: "Talisman", anzahl: 1}]},
    {name: "Kreuz", permanent: false, verteidigung: 5, baukosten: [{name: "Brett", anzahl: 5}]},
    {name: "Kerze", permanent: false, verteidigung: 0, baukosten: [{name: "Stroh", anzahl: 1}, {name: "Lupe", anzahl: 1}]},
    {name: "Fackel", permanent: false, verteidigung: 50, baukosten: [{name: "Brett", anzahl: 1}, {name: "Lupe", anzahl: 1}, {name: "Stroh", anzahl: 1}, {name: "Benzin", anzahl: 1}]},
    {name: "Stacheldraht", permanent: false, verteidigung: 10, baukosten: [{name: "Metall", anzahl: 5}]},
    {name: "Säge", permanent: false, verteidigung: 0, baukosten: [{name: "Metall", anzahl: 6}]},
    {name: "Speerfalle", permanent: false, verteidigung: 30, baukosten: [{name: "Metall", anzahl: 5}, {name: "Säge", anzahl: 1}]},
    {name: "Stolperfalle", permanent: false, verteidigung: 14, baukosten: [{name: "Metall", anzahl: 3}, {name: "Stein", anzahl: 5}, {name: "Seil", anzahl: 1}]},
    {name: "Schaufel", permanent: false, verteidigung: 0, baukosten: [{name: "Brett", anzahl: 1}, {name: "Metall", anzahl: 2}]},
    {name: "Falle", permanent: false, verteidigung: 16, baukosten: [{name: "Brett", anzahl: 5}, {name: "Schaufel", anzahl: 1}]},
    {name: "Steinschleuder", permanent: false, verteidigung: 12, baukosten: [{name: "Stein", anzahl: 5}, {name: "Seil", anzahl: 3}]},
    {name: "Sprengfalle", permanent: false, verteidigung: 80, baukosten: [{name: "TNT", anzahl: 1}, {name: "Brett", anzahl: 5}]},
    {name: "Brunnen", permanent: true, verteidigung: 0, baukosten: [{name: "Brett", anzahl: 7}, {name: "Stein", anzahl: 7}, {name: "Seil", anzahl: 1}, {name: "Schaufel", anzahl: 1}]},
    {name: "Werkstatt", permanent: true, verteidigung: 0, baukosten: [{name: "Brett", anzahl: 5}, {name: "Stein", anzahl: 7}]},
    {name: "Haus", permanent: true, verteidigung: 80, baukosten: [{name: "Brett", anzahl: 10}, {name: "Stein", anzahl: 10}]},
    {name: "Hochsitz", permanent: true, verteidigung: 0, baukosten: [{name: "Brett", anzahl: 10}, {name: "Stock", anzahl: 4}]}
]

var map = []
for (var x = 0; x < 16; x++) {
    map[x] = []
    for (var i = 0; i < 16; i++) {
        map[x][i] = 0
    }
}

function startTimer(duration) {
  if (isGameover == false) {
    var timer = duration, minutes, seconds
    mytimer = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10)

        minutes = minutes < 10 ? "0" + minutes : minutes
        seconds = seconds < 10 ? "0" + seconds : seconds

        $('#timer').text("-" + minutes + ":" + seconds)

        if (--timer < 0) {
            clearInterval(mytimer)
            ZombieAttack()
            myTimeout = setTimeout(function() {                
                startTimer(60 * 1)
            }, 5000)
        }
    }, 1000);
  }
}

jQuery(function ($) {
    var fiveMinutes = 60 * 1, display = $('#timer')
    startTimer(fiveMinutes)
});

function ZombieAttack() {
    playAudio("https://www.youtube.com/audiolibrary_download?vid=bfb60515d518694b")
    angriffstärke = angriffstärke + randomNumberGen(15 + welle * 2, (20 + welle * 2) * spieleranzahl)
    if (angriffstärke > verteidigung) {
        $("#messages").empty()
        message("Die Zombies greifen mit " + angriffstärke + " Stärke an und du hast nur " + verteidigung + " Verteidigung. Jetzt entscheidet der Nahkampf: Überlebender gegen Zombie!")
        if (randomNumberGen(0, welle) !== 1) {
            gameover()
        } else {
            message("Du hast den Angriff mit viel Glück überlebt.")
            welle = welle + 1
            renderWelle()
        }
    } else {
        welle = welle + 1
        renderWelle()
        $("#messages").empty()
        verteidigung = verteidigung - Math.round(verteidigung * 0.20) - Math.round(angriffstärke * 0.80)
        if (verteidigung < 1) {
            verteidigung = 10
        }
        message("Der Zombieangriff wurde abgewehrt, aber deine Verteidigung hat Schaden erlitten. Du hast noch " + verteidigung + " Punkte.")
    }
    randomItems()
    wasser = wasser - randomNumberGen(1, 3)
    renderWater()
    renderVerteidigung()
}

function gameover(type) {
    isGameover = true
    playAudio("https://www.youtube.com/audiolibrary_download?vid=26fa4912b03fa459")
    clearInterval(mytimer)
    $("#frame").remove()
    $("body").addClass("gameover")
    if (type == "verdurstet") {
        $("body").html("<div style='text-align: center; font-size:300%;'><b>Du bist verdurstet.</b><br/>Du bist tot!</div><div style='text-align: center; margin-top: 20px'>Die Zombies fressen<br/>deine Leiche.</div>")
    } else {
        $("body").html("<div style='text-align: center; font-size:300%;'><b>Zombies fressen<br/> dein Gehirn.</b><br/>Du bist tot!</div><div style='text-align: center; margin-top: 20px'>Der Angriff mit Stärke " + angriffstärke + " konnte nicht<br/> von deiner Verteidigung aufgehalten werden.")
    }
}


function randomNumberGen(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function message(nachricht) {
    $("#messages").append("<p>" + nachricht + "<p/>")
    $("#messages").animate({
        scrollTop: $("#messages p").last().offset().top
    });
    if ($("#messages p").length >= 30) {
        $("#messages p:lt(10)").remove()
    }
}

function checkbuilder() {
    var canBuild = 0
    $("#builder").empty()
    for (var bb = 0; bb < techtree.length; bb++) {
        canBuild = 0
        for (var kk = 0; kk < techtree[bb].baukosten.length; kk++) {
            for (var cc = 0; cc < inventar.length; cc++) {
                if (techtree[bb].baukosten[kk].name == inventar[cc].name) {
                    if (inventar[cc].anzahl >= techtree[bb].baukosten[kk].anzahl) {
                        canBuild = canBuild + 1
                    } else {
                        canBuild = 0
                    }
                    if (canBuild == techtree[bb].baukosten.length) {
                        $("#builder").append("<div class='build' onclick='build(\""+ techtree[bb].name + "\")'>" + techtree[bb].name + " +" + techtree[bb].verteidigung +"</div>")
                    }
                }
            }
        }
    }
}

function build(building) {
    var bauKostenOK = false
    var tempVerteidigung = 0
    var tempName = ""
    var tempInventar = ""
    var onlyOnce = false
    for (var t = 0; t < techtree.length; t++) {
        if (building == techtree[t].name && techtree[t].permanent == false) {
            for (var kk = 0; kk < techtree[t].baukosten.length; kk++) {
                for (var inv = 0; inv < inventar.length; inv++) {
                    if (inventar[inv].name == techtree[t].baukosten[kk].name && inventar[inv].anzahl >= techtree[t].baukosten[kk].anzahl) {
                        inventar[inv].anzahl = inventar[inv].anzahl - techtree[t].baukosten[kk].anzahl
                        tempVerteidigung = techtree[t].verteidigung
                        tempName = techtree[t].name
                        tempInventar = techtree[t].name
                        bauKostenOK = true
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
                          if (inventar[inv].verteidigung !== undefined) {
                            verteidigung = verteidigung + inventar[inv].verteidigung
                          }
                      }
                  }
              }
          } else {
              message(map[x][y] + " ist im Weg.")
          }
        }
        if (building == techtree[t].name && techtree[t].permanent == false && bauKostenOK == true && onlyOnce == false) {
            for (var inv = 0; inv < inventar.length; inv++) {
                if (building == inventar[inv].name) {
                    inventar[inv].anzahl = inventar[inv].anzahl + 1
                }
            }
            onlyOnce == true
        }
    }
    if (bauKostenOK) {
        verteidigung = verteidigung + tempVerteidigung
        message(tempName + " wurde gebaut.")     
    }
    checkbuilder()
    renderPosition()
    renderVerteidigung()
}

function move(direction) {
    switch (direction) {
        case "top":
            if (y < 15) {
                y = y + 1
                wasser = wasser -1
                dropStuff()
                renderPosition()
            } else {
                  message("Hier geht es nicht weiter")
              }
            break
        case "down":
            if (y > 0) {
                y = y - 1
                wasser = wasser -1
                dropStuff()
                renderPosition()
            } else {
                  message("Hier geht es nicht weiter")
              }
            break
        case "right":
            if (x < 15) {
                x = x + 1
                wasser = wasser -1
                dropStuff()
                renderPosition()
            } else {
                 message("Hier geht es nicht weiter")
             }
            break
        case "left":
            if (x > 0) {
                x = x - 1
                wasser = wasser -1
                dropStuff()
                renderPosition()
            } else {
                message("Hier geht es nicht weiter")
            }
            break
    }
    checkActions()
    renderWater()
}

function renderPosition() {
    $("#cords").text("X: " + x + " Y: " + y)
    if (map[x][y] == 0) {
        $("#currentPosition").text("Nichts")
    } else {
        $("#currentPosition").text(map[x][y])
    }
    if (map[x][y] == "Brunnen" || map[x][y] == "Haus") {
        if (randomNumberGen(0,1) == 0) {
            wasser = wasser + randomNumberGen(15 + Math.round(welle / 2), 20 + welle)
            message("Du hast dir Wasser aus dem Brunnen geholt.")
        } else {
            message("Diesmal kam kein Wasser.")
        }
    }
    if (map[x][y] == "Werkstatt" || map[x][y] == "Haus") {
        if (randomNumberGen(0, 2) == 0) {
            inventar[0].anzahl = inventar[0].anzahl + 1
            inventar[1].anzahl = inventar[1].anzahl + 1
            wasser = wasser - 2
            message("Du hast ein Brett und einen Stein produziert, aber es hat dich zusätzlich zwei Wasser gekostet.")
        }
    }
    if (map[x][y] == "Haus") {
        if (randomNumberGen(0, 5) == 0) {
            verteidigung = verteidigung + 1
            message("Du hast das Haus verstärkt!")
        }
    }
    if (map[x][y] == "Hochsitz") {
        tempangriff = angriffstärke + randomNumberGen(15 + welle * 2, (20 + welle * 2) * spieleranzahl)
        message("Du hast jetzt einen guten Überblick. Der Zombieangriff könnte die Stärke "+ tempangriff +" haben.")
    }
}

function startPosition() {
    playAudioBackground("https://www.youtube.com/audiolibrary_download?vid=712a11cf5689b55c")
    x = randomNumberGen(0, 15)
    y = randomNumberGen(0, 15)
    brunnenX = x
    brunnenY = y
    map[x][y] = "Brunnen"
    message("Du bist an einem Brunnen. In einer Minuten greifen die Zombies an. Du musst Material suchen, um dich zu verteidigen! Baue Verteidigungskonstruktionen und durchsuche die Karte nach besonderen Gegenständen.")
}

function dropStuff() {
    if (map[x][y] == 0) {
        var random = randomNumberGen(0, 10)
        switch (random) {
            case 0:
                message("Hier ist nichts was dir helfen könnte.")
                break
            case 1: case 2: case 3:
                map[x][y] = "Brett"
                break
            case 4: case 5:
                map[x][y] = "Stein"
                break
            case 6:
                map[x][y] = "Stock"
                break
            case 7: 
                map[x][y] = "Metall"
                break
            case 8: 
                map[x][y] = "Seil"
                break
            case 9: 
                map[x][y] = "Wasserkanister"
                break
            case 10: 
                map[x][y] = "Stroh"
                break
        }
    }
}

function checkActions() {
    $("#actions").html("")
    for (var inv = 0; inv < inventar.length; inv++) {
        if (map[x][y] == inventar[inv].name) {
            $("#actions").html("<div class='pick' onclick='take(\""+ inventar[inv].name + "\")'>mitnehmen</div>")
        }
    }
}

function take(item) {
    for (var inv = 0; inv < inventar.length; inv++) {
        if (map[x][y] == inventar[inv].name && item == inventar[inv].name) {
            inventar[inv].anzahl++
            if (inventar[inv].anzahl > 1) {
                message(inventar[inv].anzahl +" "+ inventar[inv].plural + " im Inventar.")
            } else {
                message(inventar[inv].anzahl +" "+ inventar[inv].name + " im Inventar.")
            }
            if (inventar[inv].verteidigung !== undefined) {
                verteidigung = verteidigung + inventar[inv].verteidigung
                inventar[inv].anzahl--
            }            
            if (inventar[inv].wasser !== undefined) {
                wasser = wasser + inventar[inv].wasser
                inventar[inv].anzahl--
            }
            $("#actions").empty()
            $("#currentPosition").empty()
            map[x][y] = 0
            checkbuilder()
            renderPosition()
            renderVerteidigung()
            renderWater()
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
    baudio.volume = 0.2;
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
    $("#wasser").text(wasser + " Wasser")
    if (wasser < 10) {
        playAudio("https://www.youtube.com/audiolibrary_download?vid=07db49a10a4145d2")
        message("Achtung! Dein Wasser wird knapp. Der Brunnen ist bei X: "+ brunnenX +" Y: "+ brunnenY +".")
    }
    if (wasser <= 0) {
        gameover("verdurstet")
    }
}

function randomItems() {
    var checkX = randomNumberGen(0, 15)
    var checkY = randomNumberGen(0, 15)
    if (map[checkX][checkY] == 0) {
        var random = randomNumberGen(0, 7)
        switch (random) {
            case 0:
                map[checkX][checkY] = "Glas"
                break
            case 1:
                map[checkX][checkY] = "Pistole"
                break
            case 2:
                map[checkX][checkY] = "Talisman"
                break
            case 3:
                map[checkX][checkY] = "Lupe"
                break
            case 4:
                map[checkX][checkY] = "TNT"
                break
            case 5:
                map[checkX][checkY] = "Schwert"
                break
            case 6:
                map[checkX][checkY] = "Benzin"
                break
            case 7:
                map[checkX][checkY] = "Zaubertrank"
                break
        }
    }
}

document.onkeydown = function(evt) {
    evt = evt || window.event;
    switch (evt.keyCode) {
        case 37:
            setTimeout(function() {
                move("left");
            }, 1000)
            break;
        case 39:
            setTimeout(function() {
                move("right");
            }, 1000)
            break;
        case 38:
            setTimeout(function() {
                move("top")
            }, 1000)
            break
        case 40:
            setTimeout(function() {
                move("down")
            }, 1000)
            break
        case 32:
            /*setTimeout(function() {
                $(".pick").click()
            }, 500)*/
            break
    }
};

startPosition()
renderPosition()
renderVerteidigung()
renderWater()
renderWelle()
randomItems()
