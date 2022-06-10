const BUTTON = document.querySelector('button')
const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return value => outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}
let currentRotation
let currentRotationRateAlpha
let currentRotationRateBeta
let currentAcceleration

const FIREBALL_MAP = mapRange(800, 1400, 1, 4)

// Use Z plane to catch the jump
const ROTATION_RATE_THRESHOLD_ALPHA = -800
const ROTATION_RATE_THRESHOLD_BETA = -100
// The Y axis rotation threshold
const ROTATION_THRESHOLD = 80
const FLEX = 20

let flicked = false
let flickTimer

const RYU = new Audio(new URL('../../../assets/hadouken.mp3', import.meta.url))


const FIREBALL = document.querySelector('.fireball')
const RESET = () => {
  RYU.currentTime = 0
  RYU.removeEventListener('ended', RESET)
  flicked = false
  FIREBALL.removeEventListener('animationend', RESET)
  FIREBALL.classList.remove('fireball--firing')
}


const detectHadouken = () => {
  console.info('Detecting..')
  if (currentRotationRateAlpha <= ROTATION_RATE_THRESHOLD_ALPHA &&
      currentRotationRateBeta <= ROTATION_RATE_THRESHOLD_BETA) {
    flicked = true
    RYU.play()
    document.documentElement.style.setProperty('--scale', FIREBALL_MAP(Math.abs(currentRotationRateAlpha)))
    FIREBALL.classList.add('fireball--firing')
    FIREBALL.addEventListener('animationend', RESET)
  }
}


const handleOrientation = ({ beta }) => {
  currentRotation = Math.round(beta)
  if ((currentRotation <= ROTATION_THRESHOLD + FLEX) && 
      (currentRotation >= ROTATION_THRESHOLD - FLEX) && !flicked) detectHadouken()
}


const handleMotion = ({ acceleration: { y }, rotationRate: { alpha, beta }}) => {
  currentRotationRateAlpha = alpha
  currentRotationRateBeta = beta
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