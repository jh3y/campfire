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

const handleOrientation = ({ alpha, beta, gamma }) => {
	console.info({ alpha, beta, gamma })
	ALPHA.value = ALPHA_MAPPER(alpha)
	BETA.value = BETA_MAPPER(beta)
	GAMMA.value = GAMMA_MAPPER(gamma)
}

window.addEventListener('deviceorientation', handleOrientation)