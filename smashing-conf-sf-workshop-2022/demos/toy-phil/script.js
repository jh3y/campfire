const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return value => outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}

// Use the rotation as the release point
let currentRotation
// Use the acceleration to gauge how much spin there is.
let currentAcceleration
let rollTimer

const STATE = {
  SLEEPING: false,
  LIFTING: false,
  ROLLING_OFF: false,
}

const AUDIO = {
  SIGH: new Audio(new URL('../../../assets/sigh.mp3', import.meta.url)),
  FUN: new Audio(new URL('../../../assets/phil-fun.mp3', import.meta.url)),
  DAM: new Audio(new URL('../../../assets/phil-dam.mp3', import.meta.url)),
}

const CLASSES = {
  BASE: 'yoyo',
  SLEEP: 'yoyo--sleeping',
  ROLL: 'yoyo--off',
  LIFT: 'yoyo--lifting',

}

const LIFT_THRESHOLD = 50
const LIFT_ACCELERATION_THRESHOLD = 200
const ACCELERATION_THRESHOLD = 500
const SLEEP_THRESHOLD = 0

const YOYO = document.querySelector('.yoyo')
const BUTTON = document.querySelector('button')


const SLEEP_MAPPER = mapRange(100, 1400, 1000, 10000)

const RESET = () => {
  console.info('reset')
  YOYO.className = CLASSES.BASE
  STATE.SLEEPING = false
  STATE.LIFTING = false
  STATE.ROLLING_OFF = false
  YOYO.removeEventListener('transitionend', RESET)
  if (rollTimer) clearTimeout(rollTimer)
}

const ROLL_OUT = () => {
  console.info('roll off')
  AUDIO.SIGH.play()
  YOYO.classList.remove(CLASSES.SLEEP)
  YOYO.classList.add(CLASSES.ROLL)
  STATE.ROLLING_OFF = true
  if (rollTimer) clearTimeout(rollTimer)
  // At the end of a die off, set sleeping to false and reset the yoyo.
  YOYO.addEventListener('transitionend', RESET)
}

const detectSleep = () => {
  console.info('sleep?')
  if (Math.abs(currentAcceleration) > ACCELERATION_THRESHOLD) {
    STATE.SLEEPING = true
    YOYO.classList.add(CLASSES.SLEEP)
    const SLEEP_RANGE = SLEEP_MAPPER(Math.abs(currentAcceleration))
    rollTimer = setTimeout(ROLL_OUT, SLEEP_RANGE)
    AUDIO[Math.random() > 0.5 ? 'FUN' : 'DAM'].play()
    // Calculate the velocity for a timing range.
    // At the end of the sleep, die off.
    // Or... If we detect a current rotation that is greater than 50?
  }
  
}

const detectUnsleep = () => {
  console.info('unsleep?', currentAcceleration, LIFT_ACCELERATION_THRESHOLD)
  // Add a class to unsleep
  if (Math.abs(currentAcceleration) >= LIFT_ACCELERATION_THRESHOLD) {
    console.info('lift it')
    if (rollTimer) clearTimeout(rollTimer)
    STATE.SLEEPING = false
    STATE.LIFTING = true
    YOYO.classList.remove(CLASSES.SLEEP)
    YOYO.classList.add(CLASSES.LIFT)
    YOYO.addEventListener('transitionend', RESET)
  }
}

const handleOrientation = ({ beta }) => {
  currentRotation = Math.round(beta)
  if (!STATE.SLEEPING && !STATE.LIFTING && !STATE.ROLLING_OFF && (currentRotation <= SLEEP_THRESHOLD)) detectSleep()
  if (STATE.SLEEPING && !STATE.ROLLING_OFF && (currentRotation >= LIFT_THRESHOLD)) detectUnsleep()
}

const handleMotion = ({ rotationRate: { alpha }}) => {
  currentAcceleration = Math.round(alpha)
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