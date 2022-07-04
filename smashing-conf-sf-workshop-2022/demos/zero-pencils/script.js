const SVG = document.querySelector('svg.pencil')
const OUTLINE = SVG.querySelector('path.outline')
const SQUIGGLE = SVG.querySelector('path.squiggle')
const EDGE = SVG.querySelector('path.edge')
const CLONES = SVG.querySelector('.clones')
const REFRESHER = document.querySelector('button')

const RESET = () => {
  SVG.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`)
  // OUTLINE.removeAttribute('d')
  // SQUIGGLE.removeAttribute('d')
  // EDGE.removeAttribute('d')
  CLONES.innerHTML = ''
}

let d
let outlineClone
let squiggleClone
let edgeClone

const CREATE_POINT = ({ x, y }) => {
  d += ` L${x} ${y}`
  // OUTLINE.setAttribute('d', d)
  // SQUIGGLE.setAttribute('d', d)
  // EDGE.setAttribute('d', d)
  outlineClone.setAttribute('d', d)
  squiggleClone.setAttribute('d', d)
  edgeClone.setAttribute('d', d)
}

const CLEAN = () => {
  document.body.removeEventListener('pointermove', CREATE_POINT)
  document.body.removeEventListener('pointerup', CLEAN)
}

const START = ({ x, y }) => {
  // based on <path d="M150 0 L75 200 L225 200 Z" />
  d = `M ${x} ${y}`
  // OUTLINE.setAttribute('d', d)
  // SQUIGGLE.setAttribute('d', d)
  // EDGE.setAttribute('d', d)
  //   Create the elements
  outlineClone = OUTLINE.cloneNode(true)
  squiggleClone = SQUIGGLE.cloneNode(true)
  edgeClone = EDGE.cloneNode(true)
  CLONES.appendChild(outlineClone)
  CLONES.appendChild(squiggleClone)
  CLONES.appendChild(edgeClone)
  outlineClone.setAttribute('d', d)
  squiggleClone.setAttribute('d', d)
  edgeClone.setAttribute('d', d)
  document.body.addEventListener('pointermove', CREATE_POINT)
  document.body.addEventListener('pointerup', CLEAN)
}

document.body.addEventListener('pointerdown', START)

window.addEventListener('resize', RESET)
RESET()

REFRESHER.addEventListener('click', RESET)