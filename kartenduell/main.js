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
        Runde 
    }
    runde()
}

function warteaufZug() {
    conn.on('connection', function(conn) {
        conn.on('data', function(data) {
            console.log('Received', data);
            message("Zug erhalten" + data)            
            clearTimeout(botTimeout)
            Ichbindran = true
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
        duell()
        Ichbindran = true
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
    var karteGegner = $("#gegner").attr("data-name")
    var karteSpieler = $("#feld").attr("data-name")

    if (karteGegner != "" && karteSpieler != "") {
        if (myId < gegnerId) {
            parseInt($("#gegner #verteidigung").text()) = parseInt($("#gegner #verteidigung").text()) - parseInt($("#feld #angriff").text())            
        }

        // kampf
        // wiederholen
        setTimeout(duell, 1000)
    } else {        
        runde() 
    }
}

function runde () {
    if (Ichbindran == true) {
        if ($("#hand .karte").length <= 2) {
           neueKarte(1)
        }       
        Kartespielbar (true)
        message("Du bist an der Reihe!")
    } else {
        message("Dein Gegner ist an der Reihe!")
        Kartespielbar (false)
        warteaufZug()        
    }


    $("#gegnerLeben").text(gegnerLeben)
    $("#deinLeben").text(deinLeben)
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

function Kartespielbar (bool) {
    if (bool == true) {
        $("#frame").on('click', 'div.karte[data-owner=spieler]', function() {
            $("#feld").attr("data-name", $(this).attr("data-name"))
            conn.send($(this).attr("data-name"))
            renderKarte("#feld")
            $(this).remove()
            Kartespielbar (false)
            message("Du hast "+ $(this).attr("data-name") +" gespielt.")
            Ichbindran = false
            runde()
        })
    } else {
        $("#frame").off('click', 'div.karte[data-owner=spieler]')
    }
}

init()

window.onbeforeunload = function(event)
{
    peer.destroy()
};