/* global Peer, peer, $ */

var alleKarten = [
    {name: "Bogenschütze", leben: 11, angriff: 4, verteidigung: 10, instant: "Ork"},
    {name: "Ork", leben: 15, angriff: 5, verteidigung: 12, instant: "Ritter"},
    {name: "Ritter", leben: 14, angriff: 5, verteidigung: 15, instant: "Drache"},
    {name: "Hexe", leben: 10, angriff: 6, verteidigung: 8, instant: "Henker"},
    {name: "Magier", leben: 12, angriff: 6, verteidigung: 10, instant: "Hexe"},
    {name: "Bauer", leben: 9, angriff: 3, verteidigung: 6, instant: "Hofnarr"},
    {name: "Hofnarr", leben: 5, angriff: 2, verteidigung: 5, instant: ""},
    {name: "Henker", leben: 14, angriff: 4, verteidigung: 12, instant: "Bauer"},
    {name: "Gute Fee", leben: 15, angriff: 5, verteidigung: 13, instant: "Hexe"},
    {name: "Drache", leben: 18, angriff: 5, verteidigung: 12, instant: "Magier"},
    {name: "Seeschlange", leben: 20, angriff: 4, verteidigung: 15, instant: "Gute Fee"}
]

var gegnerKarten = alleKarten.slice(0)
var deineKarten = alleKarten.slice(0)
var Ichbindran = true
var tempRunde = true
var Runde = 0
var myId = 1
var gegnerId = 2
var gegnerAuswahl = ""
var peer;
var conn;
var timeout = 0
var botMode = false


var deinLeben = 100
var gegnerLeben = 100

function init() {
    message("Willkommen")

    $("#gegnerLeben").text(gegnerLeben)
    $("#deinLeben").text(deinLeben)
    
    // karten austeilen
    neueKarte(3)
    
    aufEmpfang()
}

function renderKarte(divstring) {
    var kartename = $(divstring).attr("data-name")

    $(divstring).empty()
    $(divstring).append('<div id="leben"></div><div id="verteidigung"></div><div id="angriff"></div><div id="name"></div>')
    
    for (var index = 0; index < alleKarten.length; index++) {
        if (kartename == alleKarten[index].name) {
            $(divstring).css("background-image", "")
            $(divstring).find("#angriff").text(alleKarten[index].angriff)
            $(divstring).find("#verteidigung").text(alleKarten[index].verteidigung)
            $(divstring).find("#leben").text(alleKarten[index].leben)
            $(divstring).find("#name").text(alleKarten[index].name)
        }
    }
}

function aufEmpfang() {
    peer = new Peer(myId, {key: '5f9a43l0izfr', debug: 3});
    
    peer.on('open', function(id) {
        message("Deine Verbindungsnummer ist " + myId)
        sucheGegner()
        // console.log('My peer ID is: ' + id);
    });
    
    peer.on('error', function(err) {
        console.log(err)
        // wenn id besetzt spiel gegen diese id        
        if (err.toString().indexOf("is taken") !== -1) {
            console.log("ID besetzt. Spiele gegen diese ID!")
            gegnerId = myId
            myId++
            aufEmpfang()
        }
    });

    peer.on('connection', function (data) {
        clearTimeout(botModestartet)
        message ("Verbunden mit " + peer.id)
        runde()
        data.on('data', function(text) {
            console.log (text)
            gegnerAuswahl = text.toString()
        })
        
    });
}

function sucheGegner() {
    conn = peer.connect(gegnerId);

    message("Suche Gegner...")

    conn.on('error', function(err) {
        clearTimeout(botModestartet)
        console.log(err)
        message(err)
        if (timeout <= 10) {
            timeout++
            if (gegnerId < myId && gegnerAuswahl >= 1) {
                gegnerId--
            } else {
                gegnerId++
            }
            setTimeout(sucheGegner, 5000)
        } else {
            message("Spiel gegen Computer started")
            botMode = true
        }
    })

    var botModestartet = setTimeout(function () {
        botMode = true
        runde()
    }, 10000)
}

function warteaufZug() {
    if (botMode == false) {
        // menschlicher gegner
        if (gegnerAuswahl != "") {
            // gegner hat seine wahl gesendet
            clearTimeout(zugtimeout)
            $("#gegner").attr("data-name", gegnerAuswahl)
            renderKarte("#gegner")
            message("Gegner hat " + gegnerAuswahl + " gespielt.")
            gegnerAuswahl = ""
            Ichbindran = true
            runde()
        }
        if (gegnerAuswahl == "") {
           message("Warte auf Zug des Gegners...")
            // prüfe weiteren zug
            var zugtimeout = setTimeout(warteaufZug, 1000)
        }
    } else {
        // botmode
        setTimeout(function () {
            var computerKarte = zieheBotKarte()
            $("#gegner").attr("data-name", computerKarte)
            renderKarte("#gegner")
            message("Computer hat " + computerKarte + " gespielt.")
            Ichbindran = true
            runde()
        }, 3000)
    }
}

function zieheBotKarte() {
    return gegnerKarten[randomNumberGen(0, gegnerKarten.length) - 1].name
}

function randomNumberGen(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function neueKarte(anzahl) {
    for (var x = 0; x < anzahl; x++) {
        if (deineKarten.length > 0) {
            var zufallszahl = randomNumberGen(0, deineKarten.length - 1)
            var zufallsKarte = deineKarten[zufallszahl].name
            $("#hand").append('<div class="karte" data-name="' + zufallsKarte + '" data-owner="spieler"></div>')
            renderKarte(".karte[data-name='"+ zufallsKarte +"']")
            deineKarten.splice(zufallszahl,1)
        } else {
            message("Karten leer...")
        }
    }
}

function duell() {
    if ($("#gegner #verteidigung").text() > 0 && tempRunde == true) {
        $("#gegner #verteidigung").text(parseInt($("#gegner #verteidigung").text()) - parseInt($("#feld #angriff").text()))
    } else if ($("#feld #verteidigung").text() > 0 && tempRunde == false) {
        $("#feld #verteidigung").text(parseInt($("#feld #verteidigung").text()) - parseInt($("#gegner #angriff").text()))
    }
    if ($("#gegner #verteidigung").text() <= 0 && tempRunde == true) {
        $("#gegner #leben").text(parseInt($("#gegner #leben").text()) - parseInt($("#feld #angriff").text()))
    } else if ($("#feld #verteidigung").text() <= 0 && tempRunde == false) {
        $("#feld #leben").text(parseInt($("#feld #leben").text()) - parseInt($("#gegner #angriff").text()))
    }

    if ($("#gegner #leben").text() <= 0) {
        $("#gegner").empty()
        $("#gegner").removeAttr("data-name")
        runde()
    }

    if ($("#feld #leben").text() <= 0) {
        $("#feld").empty()
        $("#feld").removeAttr("data-name")
        runde()
    }

    $("#gegnerLeben").text(gegnerLeben)
    $("#deinLeben").text(deinLeben)

    if (tempRunde == true) {
        tempRunde = false
    } else {
        tempRunde = true
    }

    if ($("#feld #leben").text() > 0 && $("#gegner #leben").text() > 0) {
        setTimeout(duell, 3000)
    }
}

function runde () {
    Runde++
    var karteGegner = $("#gegner").attr("data-name")
    var karteSpieler = $("#feld").attr("data-name")

    if (Runde == 1) {
        if (myId < gegnerId) {
           Ichbindran = true
        } else {
            Ichbindran = false
        }
    }

    if (karteGegner != undefined && karteSpieler != undefined) {
        tempRunde = Ichbindran
        duell()
    } else if (karteSpieler == undefined) {
        Ichbindran = true
    } else if (karteGegner == undefined) {
        Ichbindran = false
    }
    
    if (Ichbindran == true) {
        SpielerZug()
        message("Du bist an der Reihe!")
        if ($("#hand .karte").length <= 2) {
            neueKarte(1)
        }
    }

    if (Ichbindran == false) {
        message("Dein Gegner ist an der Reihe!")
        warteaufZug()  
    }

    $("#gegnerId").text(gegnerId)
    $("#deineId").text(myId)
}

function message (text) {
    $("div#message").append("<p>" + text + "</p>")
    if ($("div#message p").length > 10) {
        $("div#message p").eq(0).remove()
    }
}

function SpielerZug () {
    $("#frame").on('click', 'div.karte[data-owner=spieler]', function() {
        $("#feld").attr("data-name", $(this).attr("data-name"))
        if (botMode == false) {
            conn.send($(this).attr("data-name"))
        }
        Ichbindran = false
        renderKarte("#feld")
        $(this).remove()
        message("Du hast "+ $(this).attr("data-name") +" gespielt.")
        $("#frame").off('click', 'div.karte[data-owner=spieler]')
        runde()
    })
}

init()

window.onunload = window.onbeforeunload = function(e) {
  if (!!peer && !peer.destroyed) {
    peer.destroy();
  }
};