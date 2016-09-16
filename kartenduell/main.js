/* global Peer, peer, $ */

var deineKarten = [
    {name: "Bogenschütze", leben: 11, angriff: 7, verteidigung: 10, instant: "Ork"},
    {name: "Ork", leben: 15, angriff: 5, verteidigung: 12, instant: "Ritter"},
    {name: "Ritter", leben: 14, angriff: 5, verteidigung: 15, instant: "Drache"},
    {name: "Hexe", leben: 10, angriff: 6, verteidigung: 8, instant: "Henker"},
    {name: "Magier", leben: 12, angriff: 6, verteidigung: 10, instant: "Hexe"},
    {name: "Bauer", leben: 9, angriff: 3, verteidigung: 6, instant: "Hofnarr"},
    {name: "Hofnarr", leben: 5, angriff: 2, verteidigung: 5, instant: ""},
    {name: "Henker", leben: 14, angriff: 4, verteidigung: 12, instant: "Bauer"},
    {name: "Gute Fee", leben: 15, angriff: 5, verteidigung: 13, instant: "Hexe"},
    {name: "Drache", leben: 18, angriff: 5, verteidigung: 12, instant: "Magier"}
]

var gegnerKarten = []
var Ichbindran = true
var Runde = 0
var myId = 1
var yourId = 1
var peer;
var conn;

function init() {
    // kopiere array für gegnerKarten
    gegnerKarten = deineKarten
    
    sucheGegner()
}

function renderKarte(kartenname) {
    $("")
}

function aufEmpfang() {
    peer = new Peer(myId, {key: '5f9a43l0izfr'});
    
    peer.on('open', function(id) {
        message("Deine Verbindungsnummer ist " + id)
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
    conn = peer.connect(yourId);
    
    conn.on('connection', function(conn) {
        conn.on('data', function(data) {
            console.log('Received', data);
        });
        conn.send('Hello!');
        message("Verbindung mit " +conn)
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
    if ($("div#message p").length > 20) {
        $("div#message p").eq(0).remove()
    }
}

$("div.karte").on('click', function() {
    // karte  
})

aufEmpfang()
sucheGegner()