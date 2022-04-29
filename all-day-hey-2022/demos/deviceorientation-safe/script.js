const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return value => outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}


const PROXIMITY_THRESHOLD = 20
const ALPHA_MAPPER = mapRange(0, 360, 0, 100)
const BETA_MAPPER = mapRange(-180, 180, 0, 100)
const GAMMA_MAPPER = mapRange(-90, 90, 0, 100)
const PROXIMITY_MAPPER = mapRange(0, PROXIMITY_THRESHOLD, 100, 0)

const ALPHA = document.querySelector('#alpha') // Z-axis (0deg - 360deg)
const ALPHA_LABEL = document.querySelector('[for="alpha"]') // Z-axis (0deg - 360deg)
const BETA = document.querySelector('#beta') // X-axis (-180deg - 180deg)
const BETA_LABEL = document.querySelector('[for="beta"]') // X-axis (-180deg - 180deg)
const GAMMA = document.querySelector('#gamma') // Y-axis (-90deg - 90deg)
const GAMMA_LABEL = document.querySelector('[for="gamma"]') // Y-axis (-90deg - 90deg)
const BUTTON = document.querySelector('button')
const TITLE = document.querySelector('h1')

const GET_RANDOM = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

const COMBINATIONS = [
	{
		id: 'alpha',
		unlock: GET_RANDOM(0, 100),
		input: ALPHA,
		label: ALPHA_LABEL,
		mapper: ALPHA_MAPPER,
	},
	{
		id: 'beta',
		unlock: GET_RANDOM(0, 100),
		input: BETA,
		label: BETA_LABEL,
		mapper: BETA_MAPPER,
	},
	{
		id: 'gamma',
		unlock: GET_RANDOM(0, 100),
		input: GAMMA,
		label: GAMMA_LABEL,
		mapper: GAMMA_MAPPER,
	},
]

const showCombination = step => {
	const { input, label } = COMBINATIONS[step]
	COMBINATIONS.forEach((combo, index) => {
		combo.input.style.display = combo.label.style.display = index === step ? 'block' : 'none'
	})
}

let step = 0
const handleOrientation = e => {
	const { alpha, beta, gamma } = e

	// Set the value of the step input
	const { input, id, label, mapper, unlock } = COMBINATIONS[step]
	input.value = mapper(e[id])
	
	// Let's also signal it to user how close they are to the value
	const proximity = PROXIMITY_MAPPER(Math.min(Math.max(0, Math.abs(input.value - unlock)), PROXIMITY_THRESHOLD))
	input.style.setProperty('--proximity', proximity)

	if (parseInt(input.value, 10) === unlock) {
		console.info('UNLOCKED')
		step += 1
		if (step === COMBINATIONS.length) {
			TITLE.style.display = 'block'
			input.style.display = label.style.display = 'none'
			window.removeEventListener('deviceorientation', handleOrientation)
		} else {
			showCombination(step)
		}
	}
}



/**
 * Cater for iOS being "fussy" by adding a button to kick things off h/t @Vanaf1979
 * */
const START = () => {
	BUTTON.remove()
	showCombination(step)
	if (DeviceOrientationEvent?.requestPermission) {
		DeviceOrientationEvent.requestPermission().then(permission => {
			if (permission === 'granted') window.addEventListener('deviceorientation', handleOrientation)
			else alert('You denied permission to play!')
		})
	} else {
		window.addEventListener('deviceorientation', handleOrientation)
	}
}

BUTTON.addEventListener('click', START)