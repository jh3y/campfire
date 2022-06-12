const BUTTON = document.querySelector('button')
const WAND = document.querySelector('.wand')

let currentRotation
// Let's use Z
let currentRotationRate
// Only worried about Y
let currentAcceleration
// Absolute it before checking
const ACCELERATION_THRESHOLD = 30
// Use Z plane to catch the jump
const ROTATION_RATE_THRESHOLD = -1000
// The Y axis rotation threshold
const ROTATION_THRESHOLD = -10

let flicked = false
let flickTimer

const VOLDE = new Audio(new URL('../../../assets/avada-kedavra.mp3', import.meta.url))


const RESET = () => {
  VOLDE.currentTime = 0
  VOLDE.removeEventListener('ended', RESET)
  WAND.classList.remove('wand--struck')
  flicked = false
}

const detectSpell = () => {
  if (currentRotationRate <= ROTATION_RATE_THRESHOLD && Math.abs(currentAcceleration) >= ACCELERATION_THRESHOLD) {
    flicked = true
    VOLDE.play()
    WAND.classList.add('wand--struck')
    VOLDE.addEventListener('ended', RESET)
  }
}


const handleOrientation = ({ alpha, beta, gamma }) => {
  currentRotation = Math.round(beta)
  if ((currentRotation <= ROTATION_THRESHOLD) && !flicked) detectSpell()
}


const handleMotion = ({ acceleration: { y }, rotationRate: { alpha }}) => {
  currentRotationRate = alpha
  currentAcceleration = y
}



/**
 * Cater for iOS being "fussy" by adding a button to kick things off h/t @Vanaf1979
 * */
const START = () => {
  BUTTON.remove()
  if (DeviceOrientationEvent?.requestPermission && DeviceMotionEvent?.requestPermission) {
    Promise.all([
      DeviceOrientationEvent.requestPermission(),
      DeviceMotionEvent.requestPermission(),
    ]).then(results => {
      if (results.every(result => result === 'granted')) {
        window.addEventListener('deviceorientation', handleOrientation) 
        window.addEventListener('devicemotion', handleMotion, true) 
      }
    })
  } else {
    window.addEventListener('deviceorientation', handleOrientation)
    window.addEventListener('devicemotion', handleMotion, true)
  }
}

BUTTON.addEventListener('click', START)