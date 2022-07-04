window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition


let BROTHER
const BUTTON = document.querySelector('button')
const WAND = document.querySelector('.wand')
const CHARM = document.querySelector('.charm')

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
// Need like a timer to catch the gap between the two things happening.
let deactiveTimer
let activeWindowTimer
let wandReady = false
let verbalReady = false
const TIMER = 2000

const STATE = {
  RUNNING: false,
}

const SPARKLE = new Audio(new URL('../../../assets/sparkle.mp3', import.meta.url))


const RESET = () => {
  console.info('resetting wand')
  WAND.removeEventListener('animationend', RESET)
  WAND.classList.remove('wand--struck')
  flicked = false
}

const TEARDOWN_WINDOW = () => {
  console.info('tearing down opp')
  flicked = wandReady = verbalReady = false
  STATE.ACTIVE = false
}

const END_CHARM = () => {
  CHARM.removeEventListener('animationend', END_CHARM)
  CHARM.classList.remove('charm--charming')
  clearTimeout(activeWindowTimer)
  TEARDOWN_WINDOW()
  RESET()
}

const CAST_CHARM = () => {
  console.info('casting')
  CHARM.classList.add('charm--charming')
  SPARKLE.pause()
  SPARKLE.currentTime = 0
  SPARKLE.play()
  CHARM.addEventListener('animationend', END_CHARM)
}


const detectSpell = () => {
  if (currentRotationRate <= ROTATION_RATE_THRESHOLD && Math.abs(currentAcceleration) >= ACCELERATION_THRESHOLD) {
    flicked = true
    WAND.classList.add('wand--struck')
    console.info('hit that charm physically')
    wandReady = true
    if (verbalReady) CAST_CHARM()
    else if (!verbalReady) {
      WAND.addEventListener('animationend', RESET)
      clearTimeout(activeWindowTimer)
      activeWindowTimer = setTimeout(TEARDOWN_WINDOW, TIMER)
    }
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

const ON_END = () => {
  // We may have ended on an error or unintentionally
  if (STATE.RUNNING && BROTHER) BROTHER.start()
}


const INDICATE_START = () => {
  if (!STATE.RUNNING) {
    console.info('starting recording neat...')
    STATE.RUNNING = true
  } 
}

const PHRASES = {
  CHARM: 'expecto patronum',
}

const ACTIONS = [
  {
    phrase: PHRASES.CHARM,
    action: transcript => {
      console.info('hit that charm verbally')
      verbalReady = true
      if (wandReady) CAST_CHARM()
      else if (!wandReady) {
        if (activeWindowTimer) clearTimeout(activeWindowTimer)
        activeWindowTimer = setTimeout(TEARDOWN_WINDOW, TIMER)
      }
    }
  },
]

const PROCESS_AUDIO = e => {
  const TRANSCRIPT = e.results[e.results.length - 1][0].transcript
  console.info({ TRANSCRIPT })
  const IS_FINAL = e.results[e.results.length - 1].isFinal
  if (IS_FINAL && !STATE.ACTIVE) {
    for (const ACTION of ACTIONS) {
      if (TRANSCRIPT.toLowerCase().indexOf(ACTION.phrase.toLowerCase()) !== -1) {
        ACTION.action(TRANSCRIPT)
        STATE.ACTIVE = true
      }
    }
  }
}

const CLEAN_UP = () => {
  BROTHER.stop()
  BROTHER.removeEventListener('start', INDICATE_START)
  BROTHER.removeEventListener('result', PROCESS_AUDIO)
  BROTHER.removeEventListener('end', ON_END)
}

const genProcessor = (interim) => {
  BROTHER = new window.SpeechRecognition()
  BROTHER.continuous = true
  BROTHER.interimResults = interim
  BROTHER.addEventListener('start', INDICATE_START)
  BROTHER.addEventListener('result', PROCESS_AUDIO)
  BROTHER.addEventListener('end', ON_END)
  BROTHER.start()
}

const BEGIN_TRAINING = () => {
  window.addEventListener('deviceorientation', handleOrientation) 
  window.addEventListener('devicemotion', handleMotion, true) 
  genProcessor()
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
        BEGIN_TRAINING()
      }
    })
  } else {
    BEGIN_TRAINING()
  }
}

BUTTON.addEventListener('click', START)