const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return value => outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}

const ALPHA_MAPPER = mapRange(0, 360, 0, 100)
const BETA_MAPPER = mapRange(-180, 180, 0, 100)
const GAMMA_MAPPER = mapRange(-90, 90, 0, 100)


const ALPHA = document.querySelector('#alpha') // Z-axis (0deg - 360deg)
const BETA = document.querySelector('#beta') // X-axis (-180deg - 180deg)
const GAMMA = document.querySelector('#gamma') // Y-axis (-90deg - 90deg)
const BUTTON = document.querySelector('button')

const handleOrientation = ({ alpha, beta, gamma }) => {
  // console.info({ alpha, beta, gamma })
  ALPHA.value = ALPHA_MAPPER(alpha)
  BETA.value = BETA_MAPPER(beta)
  GAMMA.value = GAMMA_MAPPER(gamma)
}

const LABEL_MIN_X = document.querySelector('.min--x')
const LABEL_MAX_X = document.querySelector('.max--x')
const LABEL_MIN_Y = document.querySelector('.min--y')
const LABEL_MAX_Y = document.querySelector('.max--y')
const LABEL_MIN_Z = document.querySelector('.min--z')
const LABEL_MAX_Z = document.querySelector('.max--z')

let minX
let maxX
let minY
let maxY
let minZ
let maxZ
const handleMotion = ({ acceleration: { x, y, z }}) => {
  console.info({ x, y, z })
  
  if (minX === undefined || x < minX) minX = Math.round(x)
  if (maxX === undefined || x > maxX) maxX = Math.round(x)
  if (minY === undefined || y < minY) minY = Math.round(y)
  if (maxY === undefined || y > maxY) maxY = Math.round(y)
  if (minZ === undefined || z < minZ) minZ = Math.round(z)
  if (maxZ === undefined || z > maxZ) maxZ = Math.round(z)
  
  LABEL_MIN_X.innerText = `Min: ${minX}`
  LABEL_MIN_Y.innerText = `Min: ${minY}`
  LABEL_MIN_Z.innerText = `Min: ${minZ}`
  LABEL_MAX_X.innerText = `Max: ${maxX}`
  LABEL_MAX_Y.innerText = `Max: ${maxY}`
  LABEL_MAX_Z.innerText = `Max: ${maxZ}`
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