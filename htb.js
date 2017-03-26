function checkLeet() {
  try {
    var now =  new Date()
    if (now.getHours() == 13 && now.getMinutes() == 37 && loaded == false) {
      loaded = true
      document.getElementById('hacktheplanet').insertAdjacentHTML('beforeend', '<span style="text-align: center; font-size: 500%"><img src="htb.gif" style="width: 50%; margin: 0 auto; display: block;"><br/><p>13:37 Uhr!</p></span>')
      document.getElementById('hacktheplanet').style.display = "block"
    } else if (loaded = true) {
      loaded = false
      document.getElementById('hacktheplanet').innerHTML = ""
      document.getElementById('hacktheplanet').style.display = "none"
    }

    setTimeout(checkLeet, 30000)
  } catch (e) {
    console.log(e.message)
  }
}
var loaded = false
checkLeet()
