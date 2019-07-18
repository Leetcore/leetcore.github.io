var geld = 2000
var gerd = 5000

var bank_limit = 1000;
var pacht = 800;
var hasHarvester = false;
var mousedown = false

var verkaufsstand = 1
var bewaesserung = 1
var tractor = false

var inventar = [
    {name: "Cucumbers", emoji: "🥒", anzahl: 0, farbe: "#3dd632", zeit: 3000, kosten: 5, verkauf: 8},
    {name: "Corn", emoji: "🌽", anzahl: 0, farbe: "#cedc47", zeit: 8000, kosten: 10, verkauf: 18},
    {name: "Bananas", emoji: "🍌", anzahl: 0, farbe: "#f5d823", zeit: 15000, kosten: 20, verkauf: 40},
    {name: "Apples", emoji: "🍎", anzahl: 0, farbe: "#d63737", zeit: 18000, kosten: 30, verkauf: 60},
    {name: "Pineapples", emoji: "🍍", anzahl: 0, farbe: "#9ba259", zeit: 25000, kosten: 50, verkauf: 100},
    {name: "Melons", emoji: "🍈", anzahl: 0, farbe: "#688e28", zeit: 30000, kosten: 100, verkauf: 200},
    {name: "Potatos", emoji: "🥔", anzahl: 0, farbe: "#825C2F", zeit: 55000, kosten: 120, verkauf: 250},
    {name: "Grapes", emoji: "🍇", anzahl: 0, farbe: "#7a4884", zeit: 70000, kosten: 400, verkauf: 700}
]
var auswahl = inventar[0].name

function baueFeld (max) {
    for (var i = 0; i < max; i++) {
        $("#feld").append('<div class="feld"></div>')
    }
}

function stats () {
    $("#geld").text(geld)
    $("#gerd").text(gerd)
    $("#selected").text(auswahl)

    if (tractor == "seed") {
      $("#tractor").text('🚜🌾')
    } else if (tractor == "harvest") {
      $("#tractor").text('🚜')
    } else if (tractor == "nomoney") {
      $("#tractor").text('🚜💲')
    } else if (tractor == "notworking") {
      $("#tractor").text('🚜💲❌')
    }

    if (geld > gerd) {
        $("#gewinner").html('<span style="color: #b51212">You win!</span> You have more money then Gerd!')
    }
    if (geld <= bank_limit * -1) {
        $("#gewinner").text("You are broke. No bank money for you!")
    }
    setTimeout(stats, 16)
}

function renderInventar() {
    for (var x = 0; x < inventar.length; x++) {
        $("#menu").append('<a href="javascript:void(0)" onclick="auswahl = \''+ inventar[x].name +'\'">'+ inventar[x].emoji + " " + inventar[x].name +' -'+ inventar[x].kosten +'$</a><br/>')
    }
    $("#menu").append('<hr><a href="javascript:void(0)" onclick="benutzeErnter()">🌾 Harvest fields -30$</a><br/>')
    $("#menu").append('<span id="harvester"><a href="javascript:void(0)" onclick="ernteMaschine()">🚜 Harvester -500$</a><span style="font-size:80%">Harvests fields every 15 seconds automatically for 10$ and seeds 5 fields if you have > 1000$.</span><br/></span')
    $("#menu").append('<a href="javascript:void(0)" onclick="benutzePflug()">Remove withered fields -1500$</a><span style="font-size:80%">Withered fields take up space. So that you can cultivate them again.</span><br/>')
    $("#menu").append('<span id="verkaufsstand"><a href="javascript:void(0)" onclick="weitererVerkaufsstand()">Quality improvements -1000$</a><span style="font-size:80%">Increases selling prices by 15%.</span><br/></span>')
    $("#menu").append('<span id="bewaesserung"><a href="javascript:void(0)" onclick="baueBewaesserung()">Water system -1000$</a><span style="font-size:80%">Reduces the growth phase of many plants by 5 seconds.</span><br/></span>')
}

function randomNumberGen(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

$(document).ready(function() {
    $("#feld").mouseleave(function () {
      mousedown = false
    }).on('touchend', function () {
      mousedown = false
    }).on('touchcancel', function () {
      mousedown = false
    });
    $("body").mouseup(function () {
      mousedown = false
    })
    $(".feld").mousedown(function () {
      mousedown = true
      crowField.call(this)
    }).on('touchend', function () {
      mousedown = false
    })
    $(".feld").on("mouseover touchmove touchstart", function () {
      if (mousedown) {
        crowField.call(this)
      }
    });
});

function crowField() {
    if ($(this).hasClass("schlecht")) {
        $("#nachricht").text("This field is withered. You must have it removed to be able to cultivate it again.")
    } else if ($(this).hasClass("waechst")) {
        $("#nachricht").text("This field is still growing.")
    } else if ($(this).hasClass("reif")) {
        for (var x = 0; x < inventar.length; x++) {
            if (inventar[x].name == $(this).attr("data-name")) {
                $(this).removeClass("reif")
                inventar[x].anzahl++
                geld = geld + inventar[x].verkauf
                $(this).text("")
                $(this).css("background-color", "")
                $(this).removeAttr("data-name")
                $("#nachricht").text("Sold for " + inventar[x].verkauf + "$")
            }
        }
    } else {
        for (var x = 0; x < inventar.length; x++) {
            if (inventar[x].name == auswahl && geld > bank_limit * -1) {
                var savedElement = this
                $(this).addClass("waechst")
                $(this).attr("data-name", auswahl)
                $(this).css("background-color", inventar[x].farbe)
                $(this).text(inventar[x].emoji)
                geld = geld - inventar[x].kosten
                setTimeout(function () {
                    if (randomNumberGen(0,5) == 0) {
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
}

function startGerd() {
    setTimeout(Gerd, randomNumberGen(5000,20000))
}
function Gerd() {
    gerd = gerd + randomNumberGen(0,500)
    startGerd()
}

function startPacht() {
    geld = geld - pacht
    var ueberziehungszinsen = ""
    if (geld < 0) {
        geld = geld + Math.round(geld * 0.30)
        var ueberziehungszinsen = "and "+ Math.round(geld * 0.30) +"$ overdraft interest 💸"
    }
    $("#nachricht").text("You paid your lease of -" + pacht +"$ "+ ueberziehungszinsen + ".")
    setTimeout(startPacht, 90 * 1000)
}

function benutzePflug() {
  if (geld >= 1500) {
    geld = geld - 1500
    var felderanzahl = $(".schlecht").length
    $(".schlecht").removeAttr("data-name")
    $(".schlecht").css("background-color", "")
    $(".schlecht").text("")
    $(".schlecht").removeClass("reif").removeClass("waechst")
    $(".schlecht").removeClass("schlecht")
    $("#nachricht").text("You have removed "+ felderanzahl +" withered fields.")
  } else {
    $("#nachricht").text("Not enough money...")
  }
}

function benutzeErnter(nocosts) {
    if (geld >= 30) {
      if (!nocosts) {
        geld = geld - 30
      }
        var gespeicherteFelder = $(".reif").length;

        $(".reif").each(function () {
          $(this).trigger("mousedown");
        })
        $("#nachricht").text(gespeicherteFelder +" fields were harvested.")
    }
}

function weitererVerkaufsstand() {
    if (geld >= 1000) {
        geld = geld - 1000
        for (var x = 0; x < inventar.length; x++) {
            inventar[x].verkauf = Math.round(inventar[x].verkauf * 1.15)
        }
        verkaufsstand = verkaufsstand + 1
    } else {
        $("#nachricht").text("You don't have enough money...")
    }
    if (verkaufsstand >= 3) {
        $("#verkaufsstand").remove()
    }
}

function ernteMaschine() {
  if (hasHarvester) {
    if (geld < 1000) {
      tractor = "nomoney"
    }
    if (geld >= 10) {
      geld = geld - 10
      tractor = "harvest"
      benutzeErnter(false)
      for (var index = 0; index < 5; index++) {
        setTimeout(function() {
          $('.feld').each(function() {
            if (($(this).attr('class') == "feld" || $(this).attr('class') == "feld blue") && geld >= 1000) {
              $(this).trigger('mousedown')
              tractor = "seed"
              return false;
            }
          })
        }, 1 * index * 1500)
      }
    } else {
      tractor = "notworking"
    }
    setTimeout(ernteMaschine, 15 * 1000)
  } else {
    if (geld >= 500) {
      geld = geld - 500
      hasHarvester = true
      $('#harvester').hide();
      ernteMaschine();
    }
  }
}

function baueBewaesserung() {
    if (geld >= 1000) {
        geld = geld - 1000
        for (var x = 0; x < inventar.length; x++) {
            if (inventar[x].zeit > 20000) {
                inventar[x].zeit = inventar[x].zeit - 5000
            }
        }
        //$(".feld").css("border", "1px #2257f3 solid")
        $(".feld").addClass("blue")
        bewaesserung = bewaesserung + 1
    } else {
        $("#nachricht").text("You don't have enough money...")
    }
    if (bewaesserung >= 5) {
        $("#bewaesserung").remove()
    }
}

startPacht()
baueFeld(40)
renderInventar()
stats()
startGerd()
