var auswahl = "Gurken"
var geld = 4500
var gerd = 5000

var inventar = [
    {name: "Gurken", anzahl: 0, farbe: "#3dd632", zeit: 5000, kosten: 5, verkauf: 25},
    {name: "Weizen", anzahl: 0, farbe: "#cedc47", zeit: 10000, kosten: 10, verkauf: 50},
    {name: "Bananen", anzahl: 0, farbe: "#f5d823", zeit: 20000, kosten: 20, verkauf: 75},
    {name: "Ananas", anzahl: 0, farbe: "#9ba259", zeit: 35000, kosten: 50, verkauf: 150},
    {name: "Melonen", anzahl: 0, farbe: "#688e28", zeit: 45000, kosten: 100, verkauf: 250},
    {name: "Apfelbaum", anzahl: 0, farbe: "#d63737", zeit: 60000, kosten: 200, verkauf: 500},
    {name: "Wein", anzahl: 0, farbe: "#7a4884", zeit: 120000, kosten: 500, verkauf: 1200}
]

function baueFeld (maxX, maxY) {
    var x = 0
    var y = 0    
    for (var i = 0; i < maxX; i++) {        
        for (var f = 0; f < maxY; f++) {
            $("#feld").append('<div class="feld" data-x="'+ f +'" data-y="'+ i +'"></div>')            
        }        
    }
}

function stats () {
    $("#geld").text(geld)
    $("#gerd").text(gerd)
    if (geld > gerd) {
        $("#gewinner").text("Du hast Gerd überholt. Dieser alte Angeber. Dem hast du es gezeigt!")
    }
    if (geld < -3500) {
        $("#nachricht").text("Du bist pleite!")
    }
}

function renderInventar() {
    for (var x = 0; x < inventar.length; x++) {
        $("#menu").append('<a href="javascript:void(0)" onclick="auswahl = \''+ inventar[x].name +'\'">'+ inventar[x].name +' -'+ inventar[x].kosten +'€</a><br/>')
    }
    $("#menu").append('<a href="javascript:void(0)" onclick="benutzeErnter()">Alle Felder ernten -450€</a><br/>')
    $("#menu").append('<a href="javascript:void(0)" onclick="ernteMaschine()">Erntemaschine -650€/min</a><br/><span style="font-size:80%">Erntet alle reifen Felder jede Minute.</span><br/>')
    $("#menu").append('<a href="javascript:void(0)" onclick="benutzePflug()">Verdorrte Felder entfernen -1500€</a><br/><span style="font-size:80%">Verdorrte Felder nehmen Platz weg. Damit kannst du sie neu bewirtschaften.</span><br/>')
    $("#menu").append('<a href="javascript:void(0)" onclick="weitererVerkaufsstand()">Verkaufsstand -2000€</a><br/><span style="font-size:80%">Erhöht die Verkaufspreise dauerhaft um 10%.</span><br/>')
    $("#menu").append('<a href="javascript:void(0)" onclick="baueBewaesserung()">Bewässerungssystem -2500€</a><br/><span style="font-size:80%">Reduziert die Wachstumsphase bei einige Planzen um 2 Sekunden.</span><br/>')
}

function randomNumberGen(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

$(document).ready(function() {
    $(".feld").click(function() {
        var x = $(this).attr("data-x")
        var y = $(this).attr("data-y")

        if ($(this).hasClass("schlecht")) {
            $("#nachricht").text("Dieses Feld ist verdorrt. Du musst einen Pflug einsetzen, um verdorrte Felder neu bewirtschaften zu können.")
        } else if ($(this).hasClass("waechst")) {
            // wächst noch!
        } else if ($(this).hasClass("reif")) {                        
            for (var x = 0; x < inventar.length; x++) {
                if (inventar[x].name == $(this).attr("data-name")) {
                    $(this).removeClass("reif")
                    inventar[x].anzahl++
                    geld = geld + inventar[x].verkauf
                    $(this).text("")
                    $(this).css("background-color", "")
                    $(this).removeAttr("data-name")
                }
            }
        } else {
            for (var x = 0; x < inventar.length; x++) {
                if (inventar[x].name == auswahl && geld > -3500) {
                    var savedElement = this
                    $(this).addClass("waechst")
                    $(this).attr("data-name", auswahl)
                    $(this).css("background-color", inventar[x].farbe)
                    $(this).text(inventar[x].name.substr(0,1))
                    geld = geld - inventar[x].kosten
                    setTimeout(function () {
                        if (randomNumberGen(0,3) == 0) {
                            $(savedElement).removeClass("waechst")
                            $(savedElement).addClass("schlecht")
                        } else {
                            $(savedElement).removeClass("waechst")
                            $(savedElement).addClass("reif")
                        }
                    }, inventar[x].zeit)
                }
            }
        }
    stats()      
    });
});

function startGerd() {
    setTimeout(Gerd, randomNumberGen(5000,20000))
}
function Gerd() {
    gerd = gerd + randomNumberGen(100,350)
    stats()
    startGerd()
}

function startPacht() {
    geld = geld - 1500
    $("#nachricht").text("Du hast deine Pacht von -1500€ gezahlt!")
    setTimeout(startPacht, 60000)
    stats()
}

function benutzePflug() {
    geld = geld - 1500
    var felderanzahl = $(".schlecht").length
    $(".schlecht").removeAttr("data-name")
    $(".schlecht").css("background-color", "")
    $(".schlecht").text("")
    $(".schlecht").removeClass("reif").removeClass("waechst")
    $(".schlecht").removeClass("schlecht")
    $("#nachricht").text("Du hast "+ felderanzahl +" verdorrte Felder entfernt.")
    stats()
}

function benutzeErnter() {
    if (geld > -3500) {
        geld = geld - 450

        var gespeicherteFelder = $(".reif").length

        for (var f = 0; f < gespeicherteFelder; f++) {
            for (var x = 0; x < inventar.length; x++) {
                if (inventar[x].name == $(".reif").eq(0).attr("data-name")) {
                    inventar[x].anzahl++
                    geld = geld + inventar[x].verkauf
                    $(".reif").eq(0).text("")
                    $(".reif").eq(0).css("background-color", "")
                    $(".reif").eq(0).removeAttr("data-name")
                    $(".reif").eq(0).removeClass("reif")
                }
            }
        } 
        $("#nachricht").text("Es wurden "+ gespeicherteFelder +" Felder geerntet.")  
    }
    stats()
}

function weitererVerkaufsstand() {
    geld = geld - 2000
    stats()
    for (var x = 0; x < inventar.length; x++) {
        inventar[x].preis = Math.round(inventar[x].verkauf * 1.1)
    }
}

function ernteMaschine() {
    benutzeErnter()
    geld = geld - 200
    setTimeout(ernteMaschine, 60000)
}

function baueBewaesserung() {
    geld = geld - 2500
    for (var x = 0; x < inventar.length; x++) {
        if (inventar[x].zeit > 15000) {
            inventar[x].zeit = inventar[x].zeit - 2000
        }
    }
    //$(".feld").css("border", "1px #2257f3 solid")
    $(".feld").addClass("blue")
    stats()
}

startPacht()
baueFeld(10,10)
renderInventar()
stats()
startGerd()
