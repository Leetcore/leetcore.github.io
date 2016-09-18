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
var Runde = 0
var myId = 1
var peer;
var conn;

var deinLeben = 100
var gegnerLeben = 100

function init() {
    message("Willkommen")
    
    // karten austeilen
    neueKarte(3)
    
    aufEmpfang()
}

function renderKarte(divstring) {
    var kartename = $(divstring).attr("data-name")

    $(divstring).empty
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
    peer = new Peer(myId, {key: '5f9a43l0izfr'});
    
    peer.on('open', function(id) {
        message("Deine Verbindungsnummer ist " + id)
        sucheGegner()
        // console.log('My peer ID is: ' + id);
    });
    
    peer.on('error', function(err) {
        message(err)
        // wenn id besetzt spiel gegen diese id        
        if (err.toString().indexOf("is taken") !== -1) {
            message("Keine Verbindungsnummer ist frei. Versuche es später wieder...")
            myId++
            aufEmpfang()
        }
    });
}

function sucheGegner() {
    conn = peer.connect(prompt("Deine ID ist " + myId + ". Gegner ID:"));
    if (conn.peer < myId) {
        Ichbindran = false
    }
    runde()
}

function warteaufZug() {
    conn.on('connection', function(conn) {
        conn.on('data', function(data) {
            console.log('Received', data);
            message("Zug erhalten" + data)            
            clearTimeout(botTimeout)
            runde()
        });
        conn.on('error', function(err) { 
            message("Verbindung nicht möglich.")
        });
    });

    var botTimeout = setTimeout(function () {
        var computerKarte = botMode()
        $("#gegner").attr("data-name", computerKarte)
        renderKarte("#gegner")
        message("Computer hat " + computerKarte + " gespielt.")
        runde()
    }, 10000)
}

function botMode() {
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
    if ($("#gegner #verteidigung").text() > 0 && tempRunde == false) {
        $("#gegner #verteidigung").text(parseInt($("#gegner #verteidigung").text()) - parseInt($("#feld #angriff").text()))
    } else if ($("#feld #verteidigung").text() > 0 && tempRunde == true) {
        $("#feld #verteidigung").text(parseInt($("#feld #verteidigung").text()) - parseInt($("#gegner #angriff").text()))
    }
    if ($("#gegner #verteidigung").text() <= 0 && tempRunde == false) {
        $("#gegner #leben").text(parseInt($("#gegner #leben").text()) - parseInt($("#feld #angriff").text()))
    } else if ($("#feld #verteidigung").text() <= 0 && tempRunde == true) {
        $("#feld #leben").text(parseInt($("#feld #leben").text()) - parseInt($("#gegner #angriff").text()))
    }

    if ($("#gegner #leben").text() <= 0) {
        $("#gegner").empty()
        $("#gegner").attr("data-name", "")
        if (Ichbindran == true) {
            Ichbindran = false
        } else {
            Ichbindran = true
        }
        runde()
    }

    if ($("#feld #leben").text() <= 0) {
        $("#feld").empty()
        $("#feld").attr("data-name", "")
        if (Ichbindran == true) {
            Ichbindran = false
        } else {
            Ichbindran = true
        }
        runde()
    }

    $("#gegnerLeben").text(gegnerLeben)
    $("#deinLeben").text(deinLeben)

    if ($("#feld #leben").text() > 0 && $("#gegner #leben").text() > 0) {
        if (tempRunde == true) {
            tempRunde == false
        } else {
            tempRunde == true
        }
        setTimeout(duell, 1000)
    }
}

function runde () {
    var karteGegner = $("#gegner").attr("data-name")
    var karteSpieler = $("#feld").attr("data-name")

    if (karteGegner != undefined && karteSpieler != undefined) {
        tempRunde = Ichbindran
        duell()
    } else if (karteSpieler == undefined) {
        Ichbindran = true
        SpielerZug()
        message("Du bist an der Reihe!")
        if ($("#hand .karte").length <= 2) {
            neueKarte(1)
        }
    } else if (karteGegner == undefined) {
        message("Dein Gegner ist an der Reihe!")
        warteaufZug()  
    }

    $("#gegnerId").text(conn.peer)
    $("#deineId").text(myId)
    Runde++
}

function message (text) {
    $("div#message").append("<p>" + text + "</p>")
    if ($("div#message p").length > 5) {
        $("div#message p").eq(0).remove()
    }
}

function SpielerZug () {
    $("#frame").on('click', 'div.karte[data-owner=spieler]', function() {
        $("#feld").attr("data-name", $(this).attr("data-name"))
        conn.send($(this).attr("data-name"))
        renderKarte("#feld")
        $(this).remove()
        message("Du hast "+ $(this).attr("data-name") +" gespielt.")
        $("#frame").off('click', 'div.karte[data-owner=spieler]')
        runde()
    })
}

init()

window.onbeforeunload = function(event) {
    peer.destroy()
};