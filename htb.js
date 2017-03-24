function checkLeet() {
  try {
    var now =  new Date()
    if (now.getHours() == 13 && now.getMinutes() == 37 || debug == true) {
      loaded = true
      document.querySelector('body').insertAdjacentHTML('beforeend', '<div id="hacktheplanet"><img src="htb.gif"><br/><p>13:37 Uhr!</p></div>')
    } else if (loaded == true) {
      document.querySelector('hacktheplanet').parentNode.removeChild(this)
    }

    setTimeout(checkLeet, 30000)
  } catch (e) {
    console.log(e.message)
}
var loaded = false
checkLeet()
