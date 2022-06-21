const HEAD = document.querySelector('head')
const ADD_PAGE_TRANSITION_SPEED = (id, speed) => {
  const PAGE_TRANSITION_STUFF = document.createElement('style')
  PAGE_TRANSITION_STUFF.setAttribute('type', 'text/css')
  PAGE_TRANSITION_STUFF.innerText = `::page-transition-container(${id}),::page-transition-outgoing-image(${id}),::page-transition-incoming-image(${id}) {animation-duration: ${speed};}`
  PAGE_TRANSITION_STUFF.innerText += `::page-transition-image-wrapper(${id}) {mix-blend-mode: normal;}`
  PAGE_TRANSITION_STUFF.innerText += `::page-transition-incoming-image(${id}),:page-transition-outgoing-image(${id}) {height: 100%;}`
  HEAD.appendChild(PAGE_TRANSITION_STUFF)
}

ADD_PAGE_TRANSITION_SPEED('avatar', '0.5s')
ADD_PAGE_TRANSITION_SPEED('strange', '0.5s')

/* Utilities */
const randomInRange = (min, max) =>
  Math.floor(
    Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min)
  )
const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return (value) =>
    outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}
// Return a hue based o the angle of a particles' segment
const getHue = (input) => {
  if (input > 0 && input <= 25) return 18
  if (input > 25 && input <= 50) return 130
  if (input > 50 && input <= 75) return 44
  if (input > 75 && input <= 100) return 215
}
// Get the angle between two points
const getAngle = (pointA, pointB, offset = 0) => {
  const angle =
    ((Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x) * 180) / Math.PI -
      90 +
      (360 + offset)) %
    360
  return angle
}

// Particle based stuff
const PARTICLE_COUNT = 36
const PARTICLES_PER_PEN = 10
// Gesture based stuff
const minRadius = 100
const movementThreshold = 10
const finishingThreshold = 5
let currentAngle
let startPoint
let centerPoint
let valid
let opened
let clockwise
let finishAngle

// Element storage
const RING = document.querySelector('.sling-ring')
const CONTAINER = document.querySelector('.sling-ring-container')
const PARTICLES = RING.querySelector('.sling-ring__ring')

// Particle generator
const generateParticles = () => {
  RING.style.setProperty('--particle-count', PARTICLE_COUNT)
  for (let p = 0; p < PARTICLE_COUNT; p++) {
    const PEN = document.createElement('div')
    PEN.className = 'sling-ring__particle-pen'
    PEN.style = `--index: ${p}; --base-delay: 0;`
    const STARTER = document.createElement('div')
    STARTER.className = 'sling-ring__particle-start'
    for (let pe = 0; pe < PARTICLES_PER_PEN; pe++) {
      const PARTICLE = document.createElement('div')
      PARTICLE.className = 'sling-ring__particle'
      PARTICLE.style.setProperty('--size', randomInRange(10, 80))
      PARTICLE.style.setProperty('--distance', randomInRange(3, 7))
      PARTICLE.style.setProperty('--x', randomInRange(0, 100))
      PARTICLE.style.setProperty('--y', randomInRange(0, 100))
      PARTICLE.style.setProperty('--rotation', randomInRange(-30, 0))
      PARTICLE.style.setProperty('--radius', randomInRange(0, 50))
      PARTICLE.style.setProperty('--delay', randomInRange(0, 100) / 100)
      PARTICLE.style.setProperty('--speed', randomInRange(25, 125) / 100)
      PARTICLE.style.setProperty(
        '--hue',
        getHue(Math.round((p / PARTICLE_COUNT) * 100))
      )
      PARTICLE.style.setProperty('--lightness', randomInRange(20, 90))

      // Add it
      STARTER.appendChild(PARTICLE)
    }
    PEN.appendChild(STARTER)
    PARTICLES.appendChild(PEN)
  }
}

generateParticles()

const SEGMENTS = document.querySelectorAll('.sling-ring__particle-pen')
const SEGMENT_MAPPER = mapRange(0, 360, 0, SEGMENTS.length)
const IMG_OPACITY_MAPPER = mapRange(270, 330, 0, 1)
/*
 * Gesture based stuff begins here.
 */

// Used for visual indication stuff
const COMPLETE_MAPPER = mapRange(0, 360, 0, 100)
const HUE_MAPPER = mapRange(0, 360, 10, 140)
const SCALE_MAPPER = mapRange(0, 280, 0, 1)

// Gesture stuffz!
const INDICATOR = document.querySelector('.gesture-indicator')

const STYLE_INDICATOR = () => {
  INDICATOR.style.setProperty('--complete', clockwise ? 0 : 100)
  INDICATOR.style.setProperty('--hue', 10)
  INDICATOR.style.setProperty('--mask-one', clockwise ? 'white' : 'transparent')
  INDICATOR.style.setProperty('--mask-two', clockwise ? 'transparent' : 'white')
}

const ON_UPDATE = (angle, valid) => {
  if (valid) {
    // Update the opacity of the image. Pass in a normalized angle
    const NORMALIZED_ANGLE = clockwise ? angle : 360 - angle
    if (NORMALIZED_ANGLE > 30) {
      if (!CONTAINER.matches(":top-layer")) CONTAINER.showPopup()
      const IMG_OPACITY = IMG_OPACITY_MAPPER(NORMALIZED_ANGLE)
      RING.style.setProperty('--img-opacity', clockwise !== undefined ? IMG_OPACITY : 0)
      RING.style.setProperty('--ring-animation-name', 'ring-rotate')
    }
    RING.style.setProperty('--ring-scale', SCALE_MAPPER(NORMALIZED_ANGLE))
    // update the relevant segment with classList.add or classList.remove based on contains
    // work out the segment by getting the current angle and mapping it against the segments amount
    const currentSegment = Math.floor(SEGMENT_MAPPER(angle))
    SEGMENTS.forEach((s, index) => {
      if (
        index === currentSegment ||
        (clockwise && index < currentSegment) ||
        (!clockwise && index > currentSegment)
      )
        s.classList.add('sling-ring__particle-pen--animated')
      else s.classList.remove('sling-ring__particle-pen--animated')
    })
  } else if (!valid && !opened) {
    WIPE()
  }
}

CONTAINER.addEventListener('hide', () => {
  WIPE()
  document.body.addEventListener('pointerdown', START_GESTURE)
})
const ON_OPEN = () => {
  document.body.removeEventListener('pointerdown', START_GESTURE)
  // Add an event listener for when the popup is closed that adds it back.
}

const UPDATE_GESTURE = ({ x, y }) => {
  const ANGLE = Math.round(getAngle(centerPoint, { x, y }))
  if (
    clockwise === undefined &&
    currentAngle >= 1 &&
    currentAngle <= movementThreshold
  ) {
    clockwise = true
    finishAngle = 360
    RING.style.setProperty('--clockwise', 1)
    STYLE_INDICATOR()
  }
  if (
    clockwise === undefined &&
    currentAngle <= 360 &&
    currentAngle >= 360 - movementThreshold
  ) {
    clockwise = false
    finishAngle = 0
    RING.style.setProperty('--clockwise', -1)
    STYLE_INDICATOR()
  }

  const spread = Math.abs(ANGLE - currentAngle)

  if (window.__DEBUG_GESTURE) console.info({ clockwise, currentAngle, spread })

  if (spread > movementThreshold && clockwise !== undefined) valid = false

  ON_UPDATE(currentAngle, valid, opened)

  if (valid) {
    currentAngle = ANGLE
    if (clockwise !== undefined) {
      INDICATOR.style.setProperty('--complete', COMPLETE_MAPPER(currentAngle))
      INDICATOR.style.setProperty(
        '--hue',
        HUE_MAPPER(clockwise ? currentAngle : 360 - currentAngle)
      )
    }

    // Based on clockwise and finishingThreshold
    const isAClockwiseFinish =
      clockwise &&
      currentAngle <= finishAngle &&
      currentAngle >= finishAngle - finishingThreshold
    const isACounterClockwiseFinish =
      !clockwise &&
      currentAngle >= finishAngle &&
      currentAngle <= finishingThreshold
    if (isAClockwiseFinish || isACounterClockwiseFinish) {
      console.info('WE DID IT')
      opened = true
      ON_OPEN()
    }
  }
}

const WIPE = () => {
  if (CONTAINER.matches(':top-layer')) CONTAINER.hidePopup()
  document.body.style.setProperty('--selection', 'all')
  RING.style.setProperty('--clockwise', 1)
  RING.style.setProperty('--ring-animation-name', '')
  RING.style.setProperty('--img-opacity', 0)
  RING.style.setProperty('--ring-scale', 0)
  STYLE_INDICATOR()
  INDICATOR.style.setProperty('--complete', 100)
  SEGMENTS.forEach((s) => (s.className = 'sling-ring__particle-pen'))
}

// Used to reset once finger is lifted and !valid
// Can remove this if we hit valid ourselves.
const CLEAN_GESTURE = () => {
  clockwise = startPoint = centerPoint = finishAngle = undefined
  if (!opened) {
    WIPE()
  }
  document.body.removeEventListener('pointermove', UPDATE_GESTURE)
  document.body.removeEventListener('pointerup', CLEAN_GESTURE)
  STYLE_INDICATOR()
}

const START_GESTURE = ({ x, y }) => {
  console.clear()
  document.body.style.setProperty('--selection', 'none')
  startPoint = { x, y }
  centerPoint = { x, y: y + (Math.min(window.innerHeight, window.innerWidth) * 0.09) }
  RING.style.setProperty('--x', centerPoint.x)
  RING.style.setProperty('--y', centerPoint.y)
  valid = true
  opened = false
  currentAngle = 0
  document.body.addEventListener('pointermove', UPDATE_GESTURE)
  document.body.addEventListener('pointerup', CLEAN_GESTURE)
}

document.body.addEventListener('pointerdown', START_GESTURE)


// Transitions stuff
// gotta inject this into the head because my bundler doesn't like it...

// With that awkward workaround out of the way...
const NAV_CONTROLS = document.querySelector('.nav-controls')
const MAIN = document.querySelector('main')
const FORM_REVEALER = document.querySelector('[togglepopup=signin]')
const SIGN_FORM = document.querySelector('#signin')
const SIGN_AVATAR = document.querySelector('.sign-form__avatar')
const SIGN_IN_BUTTON = document.querySelector('.sign-form__button--sign-in')
const SIGN_OUT_BUTTON = document.querySelector('.sign-form__button--sign-out')

const SLING_RING_ACTIVATOR = document.querySelector('.sling-ring__activator')
const SLING_RING_IMG = document.querySelector('.sling-ring__img')
const PORTAL_MESSAGE = document.querySelector('.portal-message')
const PORTAL_CLOSE = document.querySelector('.portal-message__close')

SLING_RING_ACTIVATOR.addEventListener('click', async () => {
  const transition = document.createDocumentTransition()
  await transition.start(() => {
    SLING_RING_IMG.classList.add('sling-ring__img--fullscreen')
    PORTAL_MESSAGE.classList.add('portal-message--shown')
    PORTAL_MESSAGE.insertBefore(SLING_RING_IMG, PORTAL_CLOSE)
    CONTAINER.hidePopup()
  })
})

PORTAL_CLOSE.addEventListener('click', async () => {
  const transition = document.createDocumentTransition()
  await transition.start(() => {
    SLING_RING_IMG.classList.remove('sling-ring__img--fullscreen')
    PORTAL_MESSAGE.classList.remove('portal-message--shown')
    SLING_RING_ACTIVATOR.appendChild(SLING_RING_IMG)
  })
})

SIGN_IN_BUTTON.addEventListener('click', async () => {
  const transition = document.createDocumentTransition()
  await transition.start(() => {
    FORM_REVEALER.setAttribute('title', 'sign out')
    SIGN_FORM.hidePopup()
    NAV_CONTROLS.insertBefore(SIGN_AVATAR, FORM_REVEALER)
    SIGN_FORM.classList.add('sign-form--logout')
  })
})

SIGN_OUT_BUTTON.addEventListener('click', () => {
  SIGN_FORM.insertBefore(SIGN_AVATAR, SIGN_IN_BUTTON)
  SIGN_FORM.hidePopup()
  FORM_REVEALER.setAttribute('title', 'sign in')
  SIGN_FORM.classList.remove('sign-form--logout')
})
