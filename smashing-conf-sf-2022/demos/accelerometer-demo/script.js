// Refer to: https://web.dev/generic-sensor/
// Use for device demos and sound effects...


const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return value => outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}

const ACCEL = new Accelerometer({
  frequency: 10
})



const X_LABEL = document.querySelector('[for="x"]')
const Y_LABEL = document.querySelector('[for="y"]')
const Z_LABEL = document.querySelector('[for="z"]')
const BUTTON = document.querySelector('button')

let maxX = 0
let maxY = 0
let maxZ = 0
const handleForce = () => {
  const {
    x, y, z
  } = ACCEL
  const newX = Math.abs(Math.round(x))
  if (newX > maxX) maxX = newX
  const newY = Math.abs(Math.round(y))
  if (newY > maxY) maxY = newY
  const newZ = Math.abs(Math.round(z))
  if (newZ > maxZ) maxZ = newZ
  X_LABEL.innerText = `X: ${newX} Max: ${maxX}`
  Y_LABEL.innerText = `Y: ${newY} Max: ${maxY}`
  Z_LABEL.innerText = `Z: ${newZ} Max: ${maxZ}`
}



/**
 * Cater for iOS being "fussy" by adding a button to kick things off h/t @Vanaf1979
 * */
const START = () => {
  BUTTON.remove()
  if (DeviceOrientationEvent?.requestPermission) {
    navigator.permissions.query({ name: 'accelerometer' }).then(permission => {
      if (permission.state === 'granted') ACCEL.addEventListener('reading', handleForce)
    })
  } else {
    ACCEL.addEventListener('reading', handleForce)
  }
  ACCEL.start()
}


BUTTON.addEventListener('click', START)