// The clamp is here in case you need it. You can clamp the values between ranges
// to get more predicable results. For example, clamping the output.
// You could also do this in your CSS.
// CSS -> clamp(minRotation, rotation, maxRotation)

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return value => outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}

// These are the I/O ranges we're using.
// We are leaving the input ranges to be dictated by the HTML
const RANGES = {
  INPUT_ROTATION: {
    ALPHA: [0, 360],
    BETA: [-180, 180],
    GAMMA: [-90, 90]
  },
  OUTPUT_ROTATION: {
    ALPHA: [-360, 360],
    BETA: [-50, 50],
    GAMMA: [-90, 90],
  }
}

const ALPHA = document.querySelector('#alpha') // Z-axis (0deg - 360deg)
const BETA = document.querySelector('#beta') // X-axis (-180deg - 180deg)
const GAMMA = document.querySelector('#gamma') // Y-axis (-90deg - 90deg)

// Grab those mapping labels.
const ALPHA_MAPPING = document.querySelector('#alpha-map')
const BETA_MAPPING = document.querySelector('#beta-map')
const GAMMA_MAPPING = document.querySelector('#gamma-map')

const ALPHA_MAPPER = mapRange(RANGES.INPUT_ROTATION.ALPHA[0], RANGES.INPUT_ROTATION.ALPHA[1], ALPHA.min, ALPHA.max)
const BETA_MAPPER = mapRange(RANGES.INPUT_ROTATION.BETA[0], RANGES.INPUT_ROTATION.BETA[1], BETA.min, BETA.max)
const GAMMA_MAPPER = mapRange(RANGES.INPUT_ROTATION.GAMMA[0], RANGES.INPUT_ROTATION.GAMMA[1], GAMMA.min, GAMMA.max)

// Let's create some different mappers that take 0-100 and map them to X, Y, and Z rotation
// These are random values that you can play with.
const ROTATE_X_MAPPER = mapRange(BETA.min, BETA.max, RANGES.OUTPUT_ROTATION.BETA[0], RANGES.OUTPUT_ROTATION.BETA[1])
const ROTATE_Y_MAPPER = mapRange(ALPHA.min, ALPHA.max, RANGES.OUTPUT_ROTATION.ALPHA[0], RANGES.OUTPUT_ROTATION.ALPHA[1])
const ROTATE_Z_MAPPER = mapRange(GAMMA.min, GAMMA.max, RANGES.OUTPUT_ROTATION.GAMMA[0], RANGES.OUTPUT_ROTATION.GAMMA[1])

// Grab the element we're going to update rotation on.
const CUBE = document.querySelector('.cube')

const updateRotation = ({ alpha, beta, gamma }) => {
  // Use the input values and map them back to a different rotation.
  // It's all about that mapping function really.
  const ROTATE_X = ROTATE_X_MAPPER(BETA.value)
  const ROTATE_Y = ROTATE_Y_MAPPER(ALPHA.value)
  const ROTATE_Z = ROTATE_Z_MAPPER(GAMMA.value)
  CUBE.style.setProperty('--rotate-x', ROTATE_X)
  CUBE.style.setProperty('--rotate-y', ROTATE_Y)
  CUBE.style.setProperty('--rotate-z', ROTATE_Z)
  // Update the labels...
  ALPHA_MAPPING.innerText = `Alpha maps from ${Math.round(alpha)} to ${ALPHA.value} using [${RANGES.INPUT_ROTATION.ALPHA.toString()}]. Then maps ${ALPHA.value} to ${Math.round(ROTATE_Y)}deg using [${RANGES.OUTPUT_ROTATION.ALPHA.toString()}].`
  
  BETA_MAPPING.innerText = `Beta maps from ${Math.round(beta)} to ${BETA.value} using [${RANGES.INPUT_ROTATION.BETA.toString()}]. Then maps ${BETA.value} to ${Math.round(ROTATE_X)}deg using [${RANGES.OUTPUT_ROTATION.BETA.toString()}].`
  
  GAMMA_MAPPING.innerText = `Gamma maps from ${Math.round(gamma)} to ${GAMMA.value} using [${RANGES.INPUT_ROTATION.GAMMA.toString()}]. Then maps ${GAMMA.value} to ${Math.round(ROTATE_Z)}deg using [${RANGES.OUTPUT_ROTATION.GAMMA.toString()}].`
  
}

const handleOrientation = ({ alpha, beta, gamma }) => {
  // Here we're mapping the rotation values from 0 - 100.
  // But you could change them to whatever you like.
  // It's purely because I have them linked to inputs with value 0-100 which is easier
  // to look at and keeps the controls consistent.
  ALPHA.value = ALPHA_MAPPER(alpha)
  BETA.value = BETA_MAPPER(beta)
  GAMMA.value = GAMMA_MAPPER(gamma)
  // Update the UI
  updateRotation({ alpha, beta, gamma })

}

;[ALPHA, BETA, GAMMA].forEach(INPUT => {
  INPUT.addEventListener('input', updateRotation)
})

window.addEventListener('deviceorientation', handleOrientation)
handleOrientation({ alpha: 0, beta: 90, gamma: 0})