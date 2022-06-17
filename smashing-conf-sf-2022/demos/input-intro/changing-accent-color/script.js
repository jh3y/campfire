const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return value => outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}

const INPUT = document.querySelector('input')
const HUE_MAPPER = mapRange(0, 100, 10, 140)

const UPDATE_ACCENT = () => {
	INPUT.style.setProperty('--hue', HUE_MAPPER(parseInt(INPUT.value, 10)))
}

INPUT.addEventListener('input', UPDATE_ACCENT)