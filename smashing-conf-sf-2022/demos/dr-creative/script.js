const randomInRange = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min))
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return value => outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}
const getHue = input => {
  if (input > 0 && input <= 25) return 18
  if (input > 25 && input <= 50) return 130
  if (input > 50 && input <= 75) return 44
  if (input > 75 && input <= 100) return 215
}

const PARTICLE_COUNT = 10
const PARTICLES_PER_PEN = 36

const RING = document.querySelector('.sling-ring')
RING.style.setProperty('--particle-count', PARTICLE_COUNT)
const PARTICLES = RING.querySelector('.sling-ring__ring')

for (let p = 0; p < PARTICLE_COUNT; p++) {
  const PEN = document.createElement('div')
  PEN.className = 'sling-ring__particle-pen'
  PEN.style = `--index: ${p}; --base-delay: ${p / 5};`
  const STARTER = document.createElement('div')
  STARTER.className = 'sling-ring__particle-start'
  for (let pe = 0; pe < PARTICLES_PER_PEN; pe++) {
    const PARTICLE = document.createElement('div')
    PARTICLE.className = 'sling-ring__particle'
    // const SIZE = randomInRange(10, 80)
    PARTICLE.style.setProperty('--size', randomInRange(10, 80))
    // const DISTANCE = randomInRange(3, 7)
    PARTICLE.style.setProperty('--distance', randomInRange(3, 7))
    // const X = randomInRange(0, 100)
    PARTICLE.style.setProperty('--x', randomInRange(0, 100))
    // const Y = randomInRange(0, 100)
    PARTICLE.style.setProperty('--y', randomInRange(0, 100))
    // const ROTATION = randomInRange(-30, 0)
    PARTICLE.style.setProperty('--rotation', randomInRange(-30, 0))
    // const RADIUS = randomInRange(0, 50)
    PARTICLE.style.setProperty('--radius', randomInRange(0, 50))
    // const DELAY = randomInRange(0, 100) / 100
    PARTICLE.style.setProperty('--delay', randomInRange(0, 100) / 100)
    // const HUE = getHue(Math.round((pe / PARTICLE_COUNT) * 100))
    PARTICLE.style.setProperty('--hue', getHue(Math.round((p / PARTICLE_COUNT) * 100)))
    // const LIGHTNESS = randomInRange(20, 90)
    PARTICLE.style.setProperty('--lightness', randomInRange(20, 90))

    // Add it
    STARTER.appendChild(PARTICLE)
  }
  PEN.appendChild(STARTER)
  PARTICLES.appendChild(PEN)
}