function checkLeet() {
  try {
    var now =  new Date()
    if (now.getHours() == 13 && now.getMinutes() == 37 || debug == true) {
      loaded = true
      document.getElementById('hacktheplanet').insertAdjacentHTML('beforeend', '<img src="htb.gif"><br/><p>13:37 Uhr!</p>')
      document.getElementById('hacktheplanet').style.display = "block"
    } else if (loaded == true) {
      loaded = false
      document.getElementById('hacktheplanet').innerHTML = ""
      document.getElementById('hacktheplanet').style.display = "none"
    }

    setTimeout(checkLeet, 5000)
  } catch (e) {
    console.log(e.message)
  }
}
var loaded = false
checkLeet()
