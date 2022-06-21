import confetti from 'canvas-confetti'

const DEBUG = false
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower;
  const OUTPUT_RANGE = outputUpper - outputLower;
  return (value) =>
    outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0);
};

const COMPLETE_MAPPER = mapRange(0, 360, 0, 100)
const HUE_MAPPER = mapRange(0, 360, 10, 140)

const CHEER = new Audio(new URL('../../../assets/grunt-party--optimised.mp3', import.meta.url))

const getAngle = (pointA, pointB, offset = 0) => {
  const angle =
    ((Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x) * 180) / Math.PI -
      90 +
      (360 + offset)) %
    360;
  return angle;
};

const minRadius = 100
const movementThreshold = 10
const finishingThreshold = 5
let currentAngle
let startPoint
let centerPoint
let valid
let clockwise
let finishAngle

const POINTS = document.querySelector('.points')
const INDICATOR = document.querySelector('.indicator')

const STYLE_INDICATOR = () => {
  INDICATOR.style.setProperty('--complete', clockwise ? 0 : 100)
  INDICATOR.style.setProperty('--hue', 10)
  INDICATOR.style.setProperty('--mask-one', clockwise ? 'white' : 'transparent')
  INDICATOR.style.setProperty('--mask-two', clockwise ? 'transparent' : 'white')
}

const CREATE_POINT = ({ x, y }) => {
  const ANGLE = Math.round(getAngle(centerPoint, { x, y }));
  if (clockwise === undefined && (currentAngle >= 1 && currentAngle <= movementThreshold)) {
    clockwise = true
    finishAngle = 360
    STYLE_INDICATOR()
  }
  if (clockwise === undefined && (currentAngle <= 360 && currentAngle >= (360 - movementThreshold))) {
    clockwise = false
    finishAngle = 0
    STYLE_INDICATOR()
  }
  
  const spread = Math.abs(ANGLE - currentAngle)

  if (DEBUG) console.info({ clockwise, currentAngle, spread })
  
  if (spread > movementThreshold && clockwise !== undefined) valid = false
  
  if (valid) {
    currentAngle = ANGLE
    if (clockwise !== undefined) {
      INDICATOR.style.setProperty('--complete', COMPLETE_MAPPER(currentAngle))
      INDICATOR.style.setProperty('--hue', HUE_MAPPER(clockwise ? currentAngle : 360 - currentAngle))      
    }

    /* Generate next debug point */
    const POINT = document.createElement('div')
    POINT.className = 'point'
    POINT.style.setProperty('--hue', Math.random() * 360)
    POINT.style.setProperty('--x', x)
    POINT.style.setProperty('--y', y)
    POINTS.appendChild(POINT)
    
    // Based on clockwise and finishingThreshold     
    if (currentAngle === finishAngle) {
      console.info('WE DID IT')
      CHEER.play()
      confetti()
    }
  }

}

const CLEAN = () => {
  clockwise = startPoint = centerPoint = finishAngle = undefined
  document.body.removeEventListener('pointermove', CREATE_POINT)
  document.body.removeEventListener('pointerup', CLEAN)
  POINTS.innerHTML = ''
  STYLE_INDICATOR()
}

const START = ({ x, y }) => {
  console.clear()
  startPoint = { x, y }
  centerPoint = { x, y: y + minRadius }
  valid = true
  currentAngle = 0
  document.body.addEventListener('pointermove', CREATE_POINT)
  document.body.addEventListener('pointerup', CLEAN)
}

document.body.addEventListener('pointerdown', START)