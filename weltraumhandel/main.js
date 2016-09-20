var planeten = [
    {name: "Händler"},
    {name: "Tanke"},
    {name: "Neptun"},
    {name: "Pluto"},
    {name: "Sedna"},
    {name: "Xena"},
    {name: "Jupiter"},
    {name: "Merkur"},
    {name: "Jaffa"},
    {name: "Chulak"},
    {name: "Edora"},
    {name: "Revanna"},
    {name: "Vagonbrei"},
    {name: "Saturn"}
]

var waren = [
    {name: "Bananen", sound: "bananen.ogg"},
    {name: "Kri-Eier", sound: "krieier.ogg"},
    {name: "Mehl", sound: "mehl.ogg"}
]

var geld = 30

var raumschiff = {
    name: "Fregatte",
    // geschwindigkeit: 15000,
    geschwindigkeit: 1000,
    reichweite: 15
}

function init() {
    erstelleSchiff()
    $("body").append("<div id='stats'></div>")
    $("#stats").append("Raumschiff: <span id='raumschiffname'></span><br/>")
    $("#stats").append("Geld: <span id='geld'></span><br/>")
    $("#stats").append("Reichweite: <span id='reichweite'></span>")
    generierePlanet(randomNumberGen(50, 100))
    renderStuff()
    randomEvents()
}

function generierePlanet (anzahl) {
    for (var x = 0; x < anzahl; x++) {
        var zufall = randomNumberGen(0, planeten.length - 1)
        $("body").append("<div class='planet' style='top: "+ randomNumberGen(100, $(window).height() * 2) +"; left: "+ randomNumberGen(100, $(window).width() * 5) +"' data-name='"+ planeten[zufall].name +"'><p>"+ planeten[zufall].name +"</p></div")
    }
}

function randomNumberGen(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function renderStuff() {
    $("#raumschiffname").text(raumschiff.name)
    $("#geld").text(geld)
    $("#reichweite").text(raumschiff.reichweite)
    setTimeout(renderStuff, 1000)
}

function randomEvents() {
    // angebot erscheint
    for (var x = x; x < 5; x++) {
        var zufall = randomNumberGen(0, $(".planet").length - 1)
        $(".planet").eq(zufall).attr("data-waren", waren[randomNumberGen(0, waren.length - 1)].name)
        setTimeout($(".planet").eq(zufall).attr("data-waren", ""), randomNumberGen(30000, 90000))
    }
    setTimeout(randomEvents, 30000)
}

function erstelleSchiff () {
    $("body").append("<div id='deinSchiff' data-name='"+ raumschiff.name +"'></div>")
    $("#deinSchiff").animate({        
        left: 100,
        top: 100,
    }, {
        duration: raumschiff.geschwindigkeit - 10000
    })
    scrolleBild($("#deinSchiff"))
}

function scrolleBild (element) {
    $('html, body').animate({
        scrollTop: ($(element).position().top - $(window).height() / 2) + 25,
        scrollLeft: ($(element).position().left - $(window).width() / 2) + 40
    });
}


// events

$("html").on('mousedown', function (myclick) {
    if (raumschiff.reichweite > 0) {
        raumschiff.reichweite = raumschiff.reichweite - 1
        $("#deinSchiff").animate({
            left: myclick.pageX,
            top: myclick.pageY,
        }, {
            queue: false,
            duration: raumschiff.geschwindigkeit,
            complete: function () {
                scrolleBild($("#deinSchiff"))
            },
        })
    } else if (geld >= 20) {
        // play spruch adac
        geld = geld - 18
        raumschiff.reichweite = raumschiff.reichweite + 10
    }
})

$("html").on('click', 'div.planet', function (myplanet) {
    if ($("#deinSchiff").position().top >= myplanet.pageY - 100 && $("#deinSchiff").position().top <= myplanet.pageY + 100) {
        if ($("#deinSchiff").position().left >= myplanet.pageX - 50 && $("#deinSchiff").position().left <= myplanet.pageX + 50) {
            alert(1)
            if ($(myplanet.target).attr("data-name") == "Tanke") {
                // spruch
                if (geld - 10 >= 0) {
                    geld = geld - 10
                    reichweite = reichweite + 15
                    // gekauft
                }
            } else {
                // waren aufnehmen
                if ($(myplane.target).attr("data-waren") != "" && $("#deinSchiff").attr("data-ladung") == "") {
                    // beladen                
                    $("#deinSchiff").attr("data-ladung", $(myplane.target).attr("data-waren"))
                    $(myplane.target).attr("data-waren", "")
                    // play spruch random 1-4
                } else if ($(myplane.target).attr("data-waren") == "" && $("#deinSchiff").attr("data-ladung") != "") {
                    // verkaufen
                    for (var x = x; x < waren.length; x++) {
                        if ($("#deinSchiff").attr("data-ladung") == waren[x].name) {
                            var geld = geld + waren[x].verkaufspreis + parseInt($(myplane.target).attr("data-kurs"))
                        }
                    }            
                    $("#deinSchiff").attr("data-ladung", "")
                    // play spruch random 1-4
                }
            }
        }
    }
})

init()