const POPUP = document.querySelector("#myPopup");
const LOGO = document.querySelector("svg");
const CONTAINER = document.querySelector(".dvd__scale");
const SLIDER = document.querySelector(".dvd__slide");
const THRESHOLD = document.querySelector('#threshold')
const THRESHOLD_LABEL = document.querySelector('[for="threshold"]')

const CHEER = new Audio(new URL('../../../assets/kids-cheering.mp3', import.meta.url))

let checker;
let screensaverTimeout;
let active = false;
let SCREENSAVER_THRESHOLD = THRESHOLD.value * 1000;

document.body.classList.add('timing')
document.documentElement.style.setProperty('--threshold', THRESHOLD.value)

THRESHOLD.addEventListener('change', e => {
  SCREENSAVER_THRESHOLD = e.target.value * 1000
  document.documentElement.style.setProperty('--threshold', THRESHOLD.value)
  THRESHOLD_LABEL.innerText = `Show after: ${e.target.value} seconds.`
})

const setSaverTimer = () => {
  if (screensaverTimeout) {
    clearTimeout(screensaverTimeout);
    document.body.classList.remove('timing')
  }
  const { display } = getComputedStyle(POPUP)
  if (display === 'none') {
    document.body.classList.add('timing')
    screensaverTimeout = setTimeout(() => {
      document.body.classList.remove('timing')
      POPUP.showPopup();
      active = true;
    }, SCREENSAVER_THRESHOLD);
  }
};

const checkBounce = () => {
  const {
    top: containerTop,
    right: containerRight,
    bottom: containerBottom,
    left: containerLeft
  } = CONTAINER.getBoundingClientRect();
  const { left, right } = LOGO.getBoundingClientRect();
  const { top, bottom, height } = SLIDER.getBoundingClientRect();
  if (
    top === containerTop ||
    Math.ceil(right) === containerRight ||
    Math.ceil(bottom) === containerBottom - 5 ||
    left === containerLeft
  ) {
    if (
      (top === containerTop && Math.ceil(right) === containerRight) ||
      (top === containerTop && left === containerLeft) ||
      (Math.ceil(bottom) === containerBottom - 5 && left === containerLeft) ||
      (Math.ceil(bottom) === containerBottom - 5 &&
        Math.ceil(right) === containerRight)
    ) {
      CHEER.currentTime = 0
      CHEER.play()
    }

    LOGO.style.setProperty("--hue", Math.floor(Math.random() * 360));
  }
  checker = requestAnimationFrame(checkBounce);
};

POPUP.addEventListener("show", () => {
  checker = requestAnimationFrame(checkBounce);
});

POPUP.addEventListener("hide", () => {
  document.body.classList.remove('timing')
  cancelAnimationFrame(checker);
  setSaverTimer();
});

setSaverTimer();

["pointermove", "keypress", "scroll", "click"].forEach((e) =>                                                           
  document.body.addEventListener(e, setSaverTimer)
);
