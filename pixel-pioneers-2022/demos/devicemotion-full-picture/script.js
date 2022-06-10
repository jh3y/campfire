const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return value => outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}


let currentRotation
let currentAcceleration

const ALPHA_MAPPER = mapRange(0, 360, 0, 100)
const BETA_MAPPER = mapRange(-180, 180, 0, 100)
const GAMMA_MAPPER = mapRange(-90, 90, 0, 100)

const ALPHA = document.querySelector('#alpha') // Z-axis (0deg - 360deg)
const BETA = document.querySelector('#beta') // X-axis (-180deg - 180deg)
const GAMMA = document.querySelector('#gamma') // Y-axis (-90deg - 90deg)

const BUTTON = document.querySelector('button')

const LABEL_ROTATION_Z = document.querySelector('.rotation--z')
const LABEL_CURRENT_Z = document.querySelector('.current--z')
const LABEL_MIN_Z = document.querySelector('.min--z')
const LABEL_MAX_Z = document.querySelector('.max--z')
const LABEL_CURRENT_RATE_Z = document.querySelector('.current-rate--z')
const LABEL_MIN_RATE_Z = document.querySelector('.min-rate--z')
const LABEL_MAX_RATE_Z = document.querySelector('.max-rate--z')

const LABEL_ROTATION_Y = document.querySelector('.rotation--y')
const LABEL_CURRENT_Y = document.querySelector('.current--y')
const LABEL_MIN_Y = document.querySelector('.min--y')
const LABEL_MAX_Y = document.querySelector('.max--y')
const LABEL_CURRENT_RATE_Y = document.querySelector('.current-rate--y')
const LABEL_MIN_RATE_Y = document.querySelector('.min-rate--y')
const LABEL_MAX_RATE_Y = document.querySelector('.max-rate--y')

const LABEL_ROTATION_X = document.querySelector('.rotation--x')
const LABEL_CURRENT_X = document.querySelector('.current--x')
const LABEL_MIN_X = document.querySelector('.min--x')
const LABEL_MAX_X = document.querySelector('.max--x')
const LABEL_CURRENT_RATE_X = document.querySelector('.current-rate--x')
const LABEL_MIN_RATE_X = document.querySelector('.min-rate--x')
const LABEL_MAX_RATE_X = document.querySelector('.max-rate--x')

let minZ
let maxZ
let minRateZ
let maxRateZ

let minY
let maxY
let minRateY
let maxRateY

let minX
let maxX
let minRateX
let maxRateX

let flicked = false
let flickTimer

const detectFlick = () => {
  if (flicked) return
  if (currentRotation <= 0 && currentAcceleration <= -150 && !flicked) {
    document.body.style.backgroundColor = 'hsl(140 80% 50% / 0.25)'
    console.info('flick up')
    flicked = true
  }
  if (currentRotation >= 60 && currentAcceleration >= 150 && !flicked) {
    document.body.style.backgroundColor = 'hsl(210 80% 50% / 0.25)'
    console.info('flick down')
    flicked = true
  }
  if (flicked) {
    flickTimer = setTimeout(() => {
      document.body.removeAttribute('style')
      flicked = false
    }, 5000) 
  }
}

const handleOrientation = ({ alpha, beta, gamma }) => {
  // console.info({ alpha, beta, gamma })
  BETA.value = BETA_MAPPER(beta)
  ALPHA.value = ALPHA_MAPPER(alpha)
  GAMMA.value = GAMMA_MAPPER(gamma)

  LABEL_ROTATION_Z.innerText = `Current: ${Math.round(alpha)}`
  LABEL_ROTATION_Y.innerText = `Current: ${Math.round(beta)}`
  LABEL_ROTATION_X.innerText = `Current: ${Math.round(gamma)}`

  // Wrist stuff
  currentRotation = Math.round(beta)
}





const handleMotion = ({ acceleration: { x, y, z }, rotationRate: { alpha, beta, gamma }}) => {
  // console.info({ y })
  
  // Alpha + Z
  if (minZ === undefined || z < minZ) minZ = Math.round(z)
  if (maxZ === undefined || z > maxZ) maxZ = Math.round(z)
  if (minRateZ === undefined || alpha < minRateZ) minRateZ = Math.round(alpha)
  if (maxRateZ === undefined || alpha > maxRateZ) maxRateZ = Math.round(alpha)
  
  LABEL_MIN_Z.innerText = `Min: ${minZ}`
  LABEL_MAX_Z.innerText = `Max: ${maxZ}`
  LABEL_CURRENT_Z.innerText =`Current: ${Math.round(z)}`
  
  LABEL_MIN_RATE_Z.innerText = `Min: ${minRateZ}`
  LABEL_MAX_RATE_Z.innerText = `Max: ${maxRateZ}`
  LABEL_CURRENT_RATE_Z.innerText =`Current: ${Math.round(alpha)}`
  
  // Beta + Y
  if (minY === undefined || y < minY) minY = Math.round(y)
  if (maxY === undefined || y > maxY) maxY = Math.round(y)
  if (minRateY === undefined || beta < minRateY) minRateY = Math.round(beta)
  if (maxRateY === undefined || beta > maxRateY) maxRateY = Math.round(beta)
  
  LABEL_MIN_Y.innerText = `Min: ${minY}`
  LABEL_MAX_Y.innerText = `Max: ${maxY}`
  LABEL_CURRENT_Y.innerText =`Current: ${Math.round(y)}`
  
  LABEL_MIN_RATE_Y.innerText = `Min: ${minRateY}`
  LABEL_MAX_RATE_Y.innerText = `Max: ${maxRateY}`
  LABEL_CURRENT_RATE_Y.innerText =`Current: ${Math.round(beta)}`
  
  
  // Gamma + X   
  if (minX === undefined || x < minX) minX = Math.round(x)
  if (maxX === undefined || x > maxX) maxX = Math.round(x)
  if (minRateX === undefined || gamma < minRateX) minRateX = Math.round(gamma)
  if (maxRateX === undefined || gamma > maxRateX) maxRateX = Math.round(gamma)
  
  LABEL_MIN_X.innerText = `Min: ${minX}`
  LABEL_MAX_X.innerText = `Max: ${maxX}`
  LABEL_CURRENT_X.innerText =`Current: ${Math.round(x)}`
  
  LABEL_MIN_RATE_X.innerText = `Min: ${minRateX}`
  LABEL_MAX_RATE_X.innerText = `Max: ${maxRateX}`
  LABEL_CURRENT_RATE_X.innerText =`Current: ${Math.round(gamma)}`

  // Wrist detection stuff...
  currentAcceleration = Math.round(beta) // Maybe it's better to use the Alpha Rotation actually? And use Y acceleration?
  detectFlick()
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