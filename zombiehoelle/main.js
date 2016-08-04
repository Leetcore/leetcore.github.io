var welle = 1
var verteidigung = 1
var spieleranzahl = 1

var inventar = {
    "bretter": 0,
    "steine": 0,
    ""
}

function startTimer(duration) {
    var timer = 60 * 5, minutes, seconds
    var mytimer = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10)

        minutes = minutes < 10 ? "0" + minutes : minutes
        seconds = seconds < 10 ? "0" + seconds : seconds

        $('#timer').text("-" + minutes + ":" + seconds)

        if (--timer < 0) {
            clearInterval(mytimer)
            setTimeout(function() {
                ZombieAttack(welle)
                startTimer(60 * 5)
            }, 5000)
        }
    }, 1000);
}

jQuery(function ($) {
    var fiveMinutes = 60 * 5, display = $('#timer')
    startTimer(fiveMinutes)
});

function ZombieAttack(welle) {
    var angriffstärke = randomNumberGen(5 + welle, (10 + welle) * spieleranzahl)
    var verteidigung = calcVerteidigung()
    if (angriffstärke >= verteidigung) {
        ZombieKampf()
    } else {
        // schaden berechnen
    }
}

function ZombieKampf() {
    // checkspieleranzahl

    if (randomNumberGen(0, spieleranzahl) == 0) {
        gameover()
    }
}

function gameover() {

}

function randomNumberGen(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function message(nachricht) {
    $("#messages").append("<p>" + nachricht + "<p/>")
    $("#messages").animate({
        scrollTop: $("#messages").offset().top
    }, 1000);
}

function renderInventar() {

}

function calcVerteidigung() {
    for (var x = 0; x < verteidgung.length; x++) { 
        verteidigung
    }
    return 
}