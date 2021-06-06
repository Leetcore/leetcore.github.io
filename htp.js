function checkLeet () {
  try {
    const now = new Date()
    if (now.getHours() === 13 && now.getMinutes() === 37 && loaded === false) {
      loaded = true
      document.querySelector('#hacktheplanet').innerHTML = '<span style="text-align: center; font-size: 200%"><img src="htp.gif" style="width: 80%; margin: 0 auto; display: block;"><p>13:37 Uhr!</p></span>'
    } else if (loaded === true) {
      loaded = false
      document.querySelector('#hacktheplanet').innerHTML = ''
    }

    setTimeout(checkLeet, 30000)
  } catch (e) {
    console.log(e.message)
  }
}
let loaded = false
checkLeet()
