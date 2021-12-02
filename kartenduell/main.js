/* global Peer, peer, $ */

var alleKarten = [
    {name: "Bogenschütze", leben: 11, angriff: 4, verteidigung: 10, instant: "Ork", sound: "Bogenschuetze.ogg", image: "data:image/png;base64,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"},
    {name: "Ork", leben: 15, angriff: 5, verteidigung: 12, instant: "Ritter", sound: "Ork.ogg", image: "data:image/png;base64,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"},
    {name: "Ritter", leben: 14, angriff: 5, verteidigung: 15, instant: "Drache", sound: "Ritter.ogg", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAADSCAYAAACB4wRaAAAE8klEQVR4Xu3dMVZbQRBEUWkXhCyImD2QsS5i9ocDO8PYGlVPn9ej55juX7/uHwE6tny9+OfoBq5H3503dxH48IdAYIEPb+Dw2/MEC3x4A4ffnidY4MMbOPz2PMECH97A4bfnCRb48AYOvz1PsMCHN3D47XmCBT68gcNvzxMs8J4GPj8/v/ZsnrX15eVl6yHbuvxfVQv8ux2BZx3I5bQCL1c2a0DgWV7LaQVermzWgMCzvJbTCrxc2awBgWd5LacVeLmyWQMCz/JaTivwcmWzBgSe5bWcVuDlymYNCDzLazmtwMuVzRoQeJbXclqBlyubNSDwLK/ltAIvVzZrQOBZXstpBV6ubNaAwLO8ltMKvFzZrAGBZ3ktpxV4ubJZAwLP8lpOK/ByZbMGBJ7ltZxW4OXKZg08HPDHx8csoRvTvr6+/vUrBb6xQPqXCfxHyBNc+6ji/n2wwALXNtC0zZdoX6K3PGq4l+gtdwle+nA/RYMttkQTeEutnKUCcyy2JBF4S62cpQJzLLYkeThg3+iofY5wvyYJLHBtA03bfCfLd7K2PGq+RG+p9ftST7AneMujhjvBW+4SvPThfk0CW2yJJvCWWjlLBeZYbEki8JZaOUsF5lhsSfJwwL5VWfsc4X5NEljg2gaatvlOlu9kbXnUfIneUqvvRV9++p/P/B5c+8ThTnDt7fG3PdyvSXyS2oQC1/aJ2yYwjqQ2kMC1feK2CYwjqQ0kcG2fuG0C40hqAwlc2ydum8A4ktpAAtf2idsmMI6kNpDAtX3itgmMI6kNJHBtn7htAuNIagMJXNsnbpvAOJLaQALX9onbJjCOpDaQwLV94rYJjCOpDSRwbZ+4bQLjSGoDCVzbJ26bwDiS2kAC1/aJ2yYwjqQ2kMC1feK2CYwjqQ0kcG2fuG0C40hqAwlc2ydum8A4ktpAAtf2idsmMI6kNpDAd/ZZ9WEuP32+1Z2xvo0JfGeTAv8u7thP2RFY4JteG3yJvqmm71/00weh3bnu25gn2BN807PkCb6ppv4TfGes9jF/im6vvPeCAvf23X41gdsr772gwL19t19N4PbKey8ocG/f7VcTuL3y3gsK3Nt3+9UEbq+894IC9/bdfjWB2yvvvaDAvX23X03g9sp7Lyhwb9/tVxO4vfLeCwrc23f71QRur7z3gtuB39/fv3be0vPz88717v5PA1eBz35GBD7b9yKwwFkDfg/O+kunPcFpg/B5geFAaTyB0wbh8wLDgdJ4AqcNwucFhgOl8QROG4TPCwwHSuMJnDYInxcYDpTGEzhtED4vMBwojSdw2iB8XmA4UBpP4LRB+LzAcKA0nsBpg/B5geFAaTyB0wbh89e3t7etfy/66ekJXsHZ8QQ+2/cisMBZA75EZ/2l057gtEH4vMBwoDSewGmD8HmB4UBpPIHTBuHzAsOB0ngCpw3C5wWGA6XxBE4bhM8LDAdK4wmcNgifFxgOlMYTOG0QPi8wHCiNJ3DaIHxeYDhQGk/gtEH4vMBwoDSewGmD8HmB4UBpPIHTBuHzAsOB0ngCpw3C5wWGA6XxBE4bhM8LDAdK4wmcNgifFxgOlMYTOG0QPi8wHCiNJ3DaIHxeYDhQGk/gtEH4vMBwoDSewGmD8HmB4UBpPIHTBuHzAsOB0ngCpw3C5wWGA6XxBE4bhM8LDAdK4wmcNgifFxgOlMb7BUKQ4blOp5dxAAAAAElFTkSuQmCC"},
    {name: "Hexe", leben: 10, angriff: 6, verteidigung: 8, instant: "Henker", sound: "Hexe.ogg", image: "data:image/png;base64,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"},
    {name: "Magier", leben: 12, angriff: 6, verteidigung: 10, instant: "Hexe", sound: "Magier.ogg", image: "data:image/png;base64,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"},
    {name: "Bauer", leben: 9, angriff: 3, verteidigung: 6, instant: "Hofnarr", sound: "Bauer.ogg", image: "data:image/png;base64,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"},
    {name: "Hofnarr", leben: 5, angriff: 2, verteidigung: 5, instant: "", sound: "Hofnarr.ogg", image: "data:image/png;base64,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"},
    {name: "Henker", leben: 14, angriff: 4, verteidigung: 12, instant: "Bauer", sound: "Henker.ogg", image: "data:image/png;base64,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"},
    {name: "Gute Fee", leben: 15, angriff: 5, verteidigung: 13, instant: "Hexe", sound: "Gute Fee.ogg", image: "data:image/png;base64,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"},
    {name: "Drache", leben: 18, angriff: 5, verteidigung: 12, instant: "Magier", sound: "Drache.ogg", image: "data:image/png;base64,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"},
    {name: "Seeschlange", leben: 20, angriff: 4, verteidigung: 15, instant: "Gute Fee", sound: "Seeschlange.ogg", image: "data:image/png;base64,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"}
]

var gegnerKarten = alleKarten.slice(0)
var deineKarten = alleKarten.slice(0)
var Ichbindran = true
var tempRunde = true
var Runde = 0
var Rundegestartet = false

var myId = 1
var gegnerId = 2
var gegnerAuswahl = ""
var peer;
var conn;
var timeout = 0
var mouseTimer = 0
var botMode = true

var deinLeben = 5
var gegnerLeben = 5

function init() {
    // message("Willkommen beim Kartenduell. Ein menschlicher Spieler wird automatisch gesucht. <a href='javascript:void(0)' onclick='botMode = true; peer.destroy(); runde(); this.parentNode.removeChild(this);'>Du kannst auch gegen den Computer spielen.</a>")
    message("Willkommen beim Kartenduell. Du spielst gegen den Computer.")

    $("#gegnerLeben").text(gegnerLeben)
    $("#deinLeben").text(deinLeben)
    
    // karten austeilen
    neueKarte(3)
    
    // aufEmpfang()
    runde()
}

function aufEmpfang() {
    peer = new Peer(myId, {key: '5f9a43l0izfr', debug: 2});
    
    peer.on('open', function(id) {
        message("Deine Verbindungsnummer ist " + id)
        myId = id
        message("Warte auf einen Gegner...")
        sucheGegner(gegnerId)
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
        if (err.toString().indexOf("not connect") != -1) {
            setTimeout(function () {sucheGegner(gegnerId)}, 5000)
        }
        if (err.toString().indexOf("Lost connection") != -1) {
            gegnerId = myId + 1
            sucheGegner(gegnerId)
        }
    });

    peer.on('connection', function (data) {
        peer.on('open', function() {
            message ("Verbunden mit " + conn.peer)
        })

        peer.on('disconnected', function() {
            message("Verbindung mit Gegner abgebrochen.")
            botMode = true
            runde()
            if (!!peer && !peer.destroyed) {
                peer.destroy();
            }
        })

        data.on('data', function(text) {
            console.log (text)
            if (text.indexOf("myid=") != -1) {
                var a_text = text.split("=")
                if (conn.peer.toString() != a_text[1].toString() && Rundegestartet == false) {
                    sucheGegner(a_text[1])
                } else if (conn.open) {
                    conn.send("startgame=true")
                    if (Rundegestartet == false) {
                        runde()
                    }
                }
            } else if (text.indexOf("startgame=true") != - 1) {
                console.log("Game soll starten...")
                if (Rundegestartet == false) {
                    runde()
                }
            } else {
                if (data.peer == conn.peer) {
                    message("Gegner hat " + text.toString() + " gewählt.")
                    gegnerAuswahl = text.toString()
                }
            }
        })
    });
}

function sucheGegner(id) {
    conn = peer.connect(id);
    if (typeof conn != "undefined") {
        conn.on('open', function (c) {
            conn.send("myid=" + myId)
        })
        conn.on('error', function(err) {
            console.log(err)
        })
    }
}

function renderKarte(divstring) {
    var kartename = $(divstring).attr("data-name")

    $(divstring).empty()
    $(divstring).append('<div id="leben"></div><div id="verteidigung"></div><div id="angriff"></div><div id="name"></div>')
    
    for (var index = 0; index < alleKarten.length; index++) {
        if (kartename == alleKarten[index].name) {
            $(divstring).css("background", "url("+ alleKarten[index].image + ")")
            $(divstring).find("#angriff").text(alleKarten[index].angriff)
            $(divstring).find("#verteidigung").text(alleKarten[index].verteidigung)
            $(divstring).find("#leben").text(alleKarten[index].leben)
            $(divstring).find("#name").text(alleKarten[index].name)
        }
    }
}

function warteaufZug() {
    if (botMode == false) {
        // menschlicher gegner
        if (gegnerAuswahl != "") {
            // gegner hat seine wahl gesendet
            clearTimeout(zugtimeout)
            var Kartegefunden = false
            for (var index = 0; index < gegnerKarten.length; index++) {
                if (gegnerKarten[index].name == gegnerAuswahl.toString()) {
                    $("#gegner").attr("data-name", gegnerAuswahl.toString())
                    Kartegefunden = true
                    renderKarte("#gegner")
                    message("Gegner hat " + gegnerAuswahl + " gespielt.")
                    gegnerKarten.splice(index,1)
                }
            }
            gegnerAuswahl = ""
            if (Kartegefunden == false) {
                message("Komische Nachricht erhalten...")
            } else {
                Ichbindran = true
                runde()
            }
        } else {
            message("Warte auf Zug des Gegners...")
            // prüfe weiteren zug
            zugtimeout = setTimeout(warteaufZug, 5000)
        }
    } else {
        // botmode
        setTimeout(function () {
            var computerKarte = zieheBotKarte()
            $("#gegner").attr("data-name", computerKarte)
            renderKarte("#gegner")
            message("Computer hat " + computerKarte + " gespielt.")
            Ichbindran = true
            for (var index = 0; index < gegnerKarten.length; index++) {
                if (gegnerKarten[index].name == computerKarte) {
                    gegnerKarten.splice(index,1)
                }
            }
            runde()
        }, 3000)
    }
}

function zieheBotKarte() {
    return gegnerKarten[randomNumberGen(0, gegnerKarten.length - 1)].name
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
    setTimeout( function() {
        for (var x = 0; x < alleKarten.length; x++) {
            if ($("#gegner").attr("data-name") == alleKarten[x].name) {
                if ($("#feld").attr("data-name") == alleKarten[x].instant) {
                    $("#feld #verteidigung").text(0)
                }
            }
        }
        for (var x = 0; x < alleKarten.length; x++) {
            if ($("#feld").attr("data-name") == alleKarten[x].name) {
                if ($("#gegner").attr("data-name") == alleKarten[x].instant) {
                    $("#gegner #verteidigung").text(0)
                }
            }
        }        

        if ($("#gegner #verteidigung").text() > 0 && parseInt($("#feld #angriff").text()) > 0 && tempRunde == true) {
            for (var index = 0; index < alleKarten.length; index++) {
                if ($("#feld").attr("data-name") == alleKarten[index].name) {
                    playAudio("Attack-" + alleKarten[index].sound)
                }
            }
            $("#gegner").css("border-color", "#c73030")
            $("#gegner").css("box-shadow", "0px 0px 20px 10px hsla(0,52%,37%,0.80)");
            $("#feld").css("border-color", "")
            $("#feld").css("box-shadow", "")
            $("#gegner #verteidigung").text(parseInt($("#gegner #verteidigung").text()) - parseInt($("#feld #angriff").text()))
        } else if ($("#feld #verteidigung").text() > 0 && parseInt($("#gegner #angriff").text()) > 0 && tempRunde == false) {
            for (var index = 0; index < alleKarten.length; index++) {
                if ($("#gegner").attr("data-name") == alleKarten[index].name) {
                    playAudio("Attack-" + alleKarten[index].sound)
                }
            }
            $("#feld").css("border-color", "#c73030")
            $("#feld").css("box-shadow", "0px 0px 20px 10px hsla(0,52%,37%,0.80)");
            $("#gegner").css("border-color", "")
            $("#gegner").css("box-shadow", "")
            $("#feld #verteidigung").text(parseInt($("#feld #verteidigung").text()) - parseInt($("#gegner #angriff").text()))            
        }
        if ($("#gegner #verteidigung").text() <= 0 && parseInt($("#feld #angriff").text()) > 0 && tempRunde == true) {
            for (var index = 0; index < alleKarten.length; index++) {
                if ($("#feld").attr("data-name") == alleKarten[index].name) {
                    playAudio("Attack-" + alleKarten[index].sound)
                }
            }
            $("#feld").css("border-color", "")
            $("#feld").css("box-shadow", "")
            $("#gegner").css("border-color", "#c73030")
            $("#gegner").css("box-shadow", "0px 0px 20px 10px hsla(0,52%,37%,0.80)");
            $("#gegner #leben").text(parseInt($("#gegner #leben").text()) - parseInt($("#feld #angriff").text()))
        } else if ($("#feld #verteidigung").text() <= 0 && parseInt($("#gegner #angriff").text()) > 0 && tempRunde == false) {
            for (var index = 0; index < alleKarten.length; index++) {
                if ($("#gegner").attr("data-name") == alleKarten[index].name) {
                    playAudio("Attack-" + alleKarten[index].sound)
                }
            }
            $("#gegner").css("border-color", "")
            $("#gegner").css("box-shadow", "")
            $("#feld").css("box-shadow", "0px 0px 20px 10px hsla(0,52%,37%,0.80)");
            $("#feld").css("border-color", "#c73030")
            $("#feld #leben").text(parseInt($("#feld #leben").text()) - parseInt($("#gegner #angriff").text()))
        }

        if ($("#gegner #leben").text() <= 0) {
            $("#gegner").empty()
            $("#gegner").css("background", "")
            $("#gegner").removeAttr("data-name")
            gegnerLeben--
            Ichbindran = false
            runde()
        }

        if ($("#feld #leben").text() <= 0) {
            $("#feld").empty()
            $("#feld").css("background", "")
            $("#feld").removeAttr("data-name")
            deinLeben--
            Ichbindran = true
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
            setTimeout(duell, 100)
        }
    }, 3000)
}

function runde () {
    Rundegestartet = true

    if (deinLeben <= 0) {
        $("#hand").remove()
        message("Du hast verloren...")
    } else if (gegnerLeben <= 0) {
        $("#hand").remove()
        message("Du hast gewonnen!")
    } else {
        var karteGegner = $("#gegner").attr("data-name")
        var karteSpieler = $("#feld").attr("data-name")

        if (Runde == 0) {
            if (peer == undefined || peer.id < conn.peer) {
                Ichbindran = true
            } else {
                Ichbindran = false
            }
        }

        if (karteGegner != undefined && karteSpieler != undefined) {
            tempRunde = Ichbindran
            duell()
        } else if (karteSpieler == undefined && Ichbindran == true) {
            if ($("#hand .karte").length <= 2) {
                neueKarte(1)
            }
            SpielerZug()
            message("Du bist an der Reihe!")
        } else if (karteGegner == undefined && Ichbindran == false) {
            message("Dein Gegner ist an der Reihe!")
            warteaufZug()  
        }

        $("#gegnerId").text(gegnerId)
        $("#deineId").text(myId)

        $("#gegnerLeben").text(gegnerLeben)
        $("#deinLeben").text(deinLeben)
        Runde++
    }
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
        ele = $(this)
        if (botMode == false) {
            conn.send($(this).attr("data-name"))
        }
        for (var index = 0; index < alleKarten.length; index++) {
            if ($(this).attr("data-name") == alleKarten[index].name) {
                playAudio(alleKarten[index].sound)
            }
        }
        if (ele.prev(".karte").prev(".karte").length == 1) {
            ele.css("transform", "translate(-132px, -230px)")
        } else if (ele.prev(".karte").length == 1) {
            ele.css("transform", "translate(0px, -230px)")
        } else if (ele.prev(".karte").length == 0) {
            ele.css("transform", "translate(132px, -230px)")
        }
        
        setTimeout(function () {
            ele.remove();
            renderKarte("#feld")        
            Ichbindran = false
            runde()
        }, 1500)
        message("Du hast "+ $(this).attr("data-name") +" gespielt.")
        $("#frame").off('click', 'div.karte[data-owner=spieler]')
    })
}

function randomNumberGen(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
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

init()

window.onunload = window.onbeforeunload = function(e) {
  if (!!peer && !peer.destroyed) {
    peer.destroy();
  }
};
