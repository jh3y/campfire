const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower;
  const OUTPUT_RANGE = outputUpper - outputLower;
  return (value) =>
    outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0);
};

let currentInput;
let currentBounds;
let currentIndex = 0;
let touch = false;

const CONTAINER = document.querySelector(".inputs");
const LABEL = CONTAINER.querySelector("label")
const INPUTS = [...CONTAINER.querySelectorAll("input")];
INPUTS[0].removeAttribute("disabled");
const MAX = parseInt(INPUTS[0].getAttribute('max'), 10)
const MIN = parseInt(INPUTS[0].getAttribute('min'), 10)

const swapInput = (current, next) => {
  current.setAttribute("disabled", true);
  next.removeAttribute("disabled");
  currentInput = next;
  currentIndex = parseInt(next.getAttribute('data-input-index'), 10);
  currentBounds = next.getBoundingClientRect();
  LABEL.setAttribute('for', `inputs-input--${currentIndex}`)
  currentInput.focus();
};

// Account for an offset
const getAngle = (pointA, pointB, offset) => {
  const angle =
    ((Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x) * 180) / Math.PI -
      90 +
      (360 + offset)) %
    360;
  return angle;
};

const updateInput = (input, initiateTouch) => {
  const nextInput = parseInt(input.value, 10) === MAX ? input.nextElementSibling : null;
  const previousInput =
    parseInt(input.value, 10) === MIN ? input.previousElementSibling : null;
  const swapper = nextInput || previousInput;
  
  const OVERALL_VALUE = Math.round((currentIndex * (100 / INPUTS.length)) + (((100 / INPUTS.length) / MAX) * parseInt(input.value, 10))) 
  CONTAINER.style.setProperty('--accent', mapRange(10, 130, 0, 100)(OVERALL_VALUE))
  LABEL.innerText = OVERALL_VALUE
  LABEL.style.setProperty('--scale', mapRange(0, 100, 1, 3)(OVERALL_VALUE))
  
  if (swapper) {
    // Do the stuff for the next range
    swapInput(input, swapper);
    if (touch && initiateTouch) {
      window.addEventListener("pointermove", keepGoing);
      window.addEventListener("pointerup", cancelGoing);
    }
  }
};

const keepGoing = (e) => {
  const { x, y } = e;
  // Current input value is the pointer position
  // Now we go into a new realm of calculating the position.
  // It's based on the angle. Reveal .inputs:after for debugging.
  /*
   * 1. Get center point of container
   * 2. Work out angle between pointer and center
   * 3. Set on debugging arrow.
   */

  const BOUNDS = CONTAINER.getBoundingClientRect();
  const CENTER = {
    x: BOUNDS.x + BOUNDS.width * 0.5,
    y: BOUNDS.y + BOUNDS.height * 0.5
  };

  // Get the angle between two points...
  const SEGMENT = 360 / (INPUTS.length * 2);
  // Minus the segment amount   
  const ANGLE = Math.round(getAngle(CENTER, { x, y }, SEGMENT));

  CONTAINER.style.setProperty("--angle", ANGLE - SEGMENT);
  
  const RANGE = {
    start: currentIndex * (SEGMENT * 2),
    finish: (currentIndex + 1) * (SEGMENT * 2)
  };
  
  const NEW_VALUE = mapRange(RANGE.start, RANGE.finish, 0, MAX)(ANGLE);

  currentInput.value = NEW_VALUE;
  
  updateInput(currentInput, touch);
};

const cancelGoing = () => {
  //   Wipe out the currentInput and currentBounds
  currentInput = currentBounds = null;
  //  Reset touch status
  touch = false;
  window.removeEventListener("pointermove", keepGoing);
  window.removeEventListener("pointerup", cancelGoing);
};

window.addEventListener("pointerdown", () => {
  touch = true;
});

INPUTS.forEach((input) => {
  input.addEventListener("input", (e) => {
    // In here do an update, if you get to the end, start the next one, based on pointermovement... And distance.
    updateInput(input, touch);
  });
});
