var planeten = [
    {name: "Händler"},
    {name: "Saturn"},
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
    {name: "Vagonbrei"}
]

var waren = [
    {name: "Bananen", sound: "bananen.ogg"}
]

var raumschiffe = [
    {name: "Fregatte", sound: "fregatte.ogg"}
]

var raumschiff = raumschiffe[0].name

function init() {
    erstelleSchiff()
    generierePlanet(randomNumberGen(50, 100))
}

function generierePlanet (anzahl) {
    for (var x = 0; x < anzahl; x++) {
        $("body").append("<div class='planet' style='top: "+ randomNumberGen(100, $(window).height() * 2) +"; left: "+ randomNumberGen(100, $(window).width() * 5) +"'><p>"+ planeten[randomNumberGen(0, planeten.length - 1)].name +"</p></div")
    }
}

function randomNumberGen(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function erstelleSchiff () {
    $("body").append("<div id='deinSchiff' data-name='"+ raumschiff +"'></div>")    
}

function scrolleBild (element) {
    $('html, body').animate({
        scrollTop: ($(element).position().top - $(window).height() / 2) + 25,
        scrollLeft: ($(element).position().left - $(window).width() / 2) + 40
    });
}


// events

$("html").on('mousedown', function (myclick) {
    $("#deinSchiff").animate({        
        left: myclick.pageX,
        top: myclick.pageY,
    }, {
        queue: false,
        duration: 5000,
        complete: function () {
            scrolleBild($("#deinSchiff"))
        },        
    })
})

$("html").on('click', 'div.planet', function (myplanet) {
    //if ($("#deinSchiff").position().top )
})

init()