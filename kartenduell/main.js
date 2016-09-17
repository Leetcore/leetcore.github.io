/* global Peer, peer, $ */

var alleKarten = [
    {name: "Bogenschütze", leben: 11, angriff: 7, verteidigung: 10, instant: "Ork", benutzt: false},
    {name: "Ork", leben: 15, angriff: 5, verteidigung: 12, instant: "Ritter", benutzt: false},
    {name: "Ritter", leben: 14, angriff: 5, verteidigung: 15, instant: "Drache", benutzt: false},
    {name: "Hexe", leben: 10, angriff: 6, verteidigung: 8, instant: "Henker", benutzt: false},
    {name: "Magier", leben: 12, angriff: 6, verteidigung: 10, instant: "Hexe", benutzt: false},
    {name: "Bauer", leben: 9, angriff: 3, verteidigung: 6, instant: "Hofnarr", benutzt: false},
    {name: "Hofnarr", leben: 5, angriff: 2, verteidigung: 5, instant: "", benutzt: false},
    {name: "Henker", leben: 14, angriff: 4, verteidigung: 12, instant: "Bauer", benutzt: false},
    {name: "Gute Fee", leben: 15, angriff: 5, verteidigung: 13, instant: "Hexe", benutzt: false},
    {name: "Drache", leben: 18, angriff: 5, verteidigung: 12, instant: "Magier", benutzt: false}
]

var gegnerKarten = []
var deineKarten = alleKarten
var Ichbindran = true
var Runde = 0
var myId = 1
var yourId = 1
var peer;
var conn;

function init() {
    // kopiere array für gegnerKarten
    gegnerKarten = deineKarten
    message("Willkommen")
    
    // karten austeilen
    neueKarte(3)
    
    //aufEmpfang()
    botMode()
    
    
}

function renderKarte(divstring) {
    var kartename = $(divstring).attr("data-name")
    
    $(divstring).append('<div id="angriff"></div><div id="verteidigung"></div><div id="leben"></div><div id="name"></div>')
    
    for (var index = 0; index < gegnerKarten.length; index++) {
        if (kartename == gegnerKarten[index].name) {
            $(divstring).css("background-image", "")
            $(divstring).find("#angriff").text(gegnerKarten[index].angriff)
            $(divstring).find("#verteidigung").text(gegnerKarten[index].verteidigung)
            $(divstring).find("#leben").text(gegnerKarten[index].leben)
            $(divstring).find("#name").text(gegnerKarten[index].name)
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
        peer.disconnect()
        message(err)
        if (myId <= 20) {
            myId++
            aufEmpfang ()
        } else {
            message("Keine Verbindungsnummer ist frei. Versuche es später wieder...")
        }
    });
}

function sucheGegner() {
    if (myId == yourId) {
        yourId++
    }
    conn = peer.connect(yourId);
    
    message("Connection mit " + yourId)
    
    console.log(conn)
    
    conn.on('connection', function(conn) {
        conn.on('data', function(data) {
            console.log('Received', data);
        });
        conn.send('Hello!');
        message("Verbindung mit " + conn)
    });
    
    conn.on('error', function(err) { 
        message("Verbindung nicht möglich.")
        if (yourId >= 20) {
            yourId++
            sucheGegner()
        } else {
            message ("Es wurde kein menschlicher Gegner gefunden. Bot-Modus startet.")
            botMode()
        }
    });
}

function botMode() {
    if (Ichbindran == false) {
        var zufallszahl = randomNumberGen(0, gegnerKarten.length) - 1
        var zufallsKarte = gegnerKarten[zufallszahl].name
        $("#gegner").attr("data-name", gegnerKarten[randomNumberGen(0, gegnerKarten.length) - 1].name)
        renderKarte("#gegner")
        gegnerKarten.splice(zufallszahl, 1)
    }
    setTimeout(botMode, 3000)
}

function randomNumberGen(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function neueKarte(anzahl) {
    for (var x = 0; x < anzahl; x++) {
        var zufallszahl = randomNumberGen(0, deineKarten.length - 1)
        var zufallsKarte = deineKarten[zufallszahl].name
        $("#hand").append('<div class="karte" data-name="' + zufallsKarte + '" data-owner="spieler"></div>')
        renderKarte(".karte[data-name='"+ zufallsKarte +"']")
        deineKarten.splice(zufallszahl, 1)
    }
}

function duell() {
    // karten, werte
    // kampf
    
    runde ()
}

function runde () {
    // spieler kann wieder ziehen oder wartet auf zug
    // 20 sec timeout
}

function message (text) {
    $("div#message").append("<p>" + text + "</p>")
    if ($("div#message p").length > 5) {
        $("div#message p").eq(0).remove()
    }
}

$("#frame").on('click', 'div.karte[data-owner=spieler]', function() {
    // karte  
    message($(this).attr("data-name"))
})

init()