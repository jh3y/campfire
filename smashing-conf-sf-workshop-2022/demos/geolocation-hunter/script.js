const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return value => outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}
const CLAMP = (num, min, max) => Math.min(Math.max(num, min), max);

const LABEL = document.querySelector('.debug-label')
const UNLOCK = document.querySelector('.unlock')
const CHEST = document.querySelector('.chest')
const CHEST_WRAPPER = document.querySelector('.chest-wrapper')
const CHEST_HINGE = document.querySelector('.chest__lid-hinge')
const NOTE = document.querySelector('.chest__note')
const SPINNER = document.querySelector('.chest-spinner')
const SHADOW = document.querySelector('.chest-shadow')
const BUTTON = document.querySelector('.start-button')

const REVEAL_THRESHOLD = 85

const AUDIO = {
  SUCCESS: new Audio(new URL('../../../assets/grunt-party--optimised.mp3', import.meta.url)),
  UNLOCK: new Audio(new URL('../../../assets/zelda-chest.mp3', import.meta.url)),
  SLAM: new Audio(new URL('../../../assets/anvil.mp3', import.meta.url))
}
/*
  * Geolocation Mapper based on prelogged coordinates
*/

// The last log entry signals what we're trying to find.
// const LOG = [
//   {
//     lat: 37.8088401,
//     long: -122.4315205
//   },
//   {
//     lat: 37.808832,
//     long: -122.4315111
//   },
//   {
//     lat: 37.8088271,
//     long: -122.4315093
//   },
//   {
//     lat: 37.8088195,
//     long: -122.4315185
//   }
// ]
// const PRIZE = {
//   lat: 37.8088183,
//   long: -122.4315137
// }

const LOG = [
  {
    lat: 37.8087891,
    long: -122.4315099
  },
  {
    lat: 37.808805,
    long: -122.4314708
  },
  {
    lat: 37.8087412,
    long: -122.4314638
  },
  {
    lat: 37.8087265,
    long: -122.4315292
  }
]
const PRIZE = {
  lat: 37.808774,
  long: -122.431526
}

const DISTANCES = []

const COMPOSED = LOG.map(({ lat, long }) => {
  // Calculate distance to the center point and get the longest for the mapper?
  const la = PRIZE.lat - lat; 
  const lo = PRIZE.long - long;
  const distance = Math.hypot(la,lo);
  DISTANCES.push(distance)
  return { lat, long, distance }
})

const ANIMATE_NOTE = () => {
  NOTE.removeEventListener('transitionend', ANIMATE_NOTE)
  NOTE.classList.add('chest__note--found')
}

const OPEN_CHEST = () => {
  SPINNER.removeEventListener('animationend', OPEN_CHEST)
  SPINNER.classList.remove('chest-spinner--spinning')
  CHEST_HINGE.classList.remove('chest__lid-hinge--opening')
  NOTE.addEventListener('transitionend', ANIMATE_NOTE)
  NOTE.style.setProperty('--found', 1)
  CHEST_HINGE.style.setProperty('--opened', 1)
}

const UNLOCK_SAFE = () => {
  document.documentElement.style.setProperty('--show-unlock', 0)
  document.documentElement.style.setProperty('--hunting', 0)
  AUDIO.UNLOCK.play()
  CHEST_WRAPPER.style.setProperty('--proximity', 0)
  CHEST_HINGE.classList.add('chest__lid-hinge--opening');
  SPINNER.classList.add('chest-spinner--spinning');
  SPINNER.addEventListener('animationend', OPEN_CHEST)
}

console.info({ COMPOSED, DISTANCES, MAX: Math.max(...DISTANCES) })

// Now this should map to some form of square or area and we can get a rough idea of the distance between points, right?
// Then divide that by a scale we like.

const WOBBLE_MAPPER = mapRange(0, Math.max(...DISTANCES), 100, 0)
const VIBE_MAPPER = mapRange(0, 100, 500, 50)

const UPDATE = position => {
  const {
    accuracy,
    latitude,
    longitude,
    altitude,
    altitudeAccuracy,
    heading,
    speed,
  } = position.coords;
  
  // get the distance from current point to the prize
  const la = PRIZE.lat - latitude; 
  const lo = PRIZE.long - longitude;
  const DISTANCE = Math.hypot(la,lo);
  // Throw it in the mapper
  const PROXIMITY = WOBBLE_MAPPER(CLAMP(DISTANCE, 0, Math.max(...DISTANCES)))
  // Apply to styles
  CHEST_WRAPPER.style.setProperty('--proximity', PROXIMITY)
  // Log the coordinates
  LABEL.innerText = JSON.stringify(
    {
      latitude,
      longitude,
      proximity: PROXIMITY,
    },
    undefined,
    2
  );

  const VIBRATE = VIBE_MAPPER(PROXIMITY)
  navigator.vibrate([VIBRATE])

  if (PROXIMITY >= REVEAL_THRESHOLD) {
    document.documentElement.style.setProperty('--show-unlock', 1);
  } else {
    document.documentElement.style.setProperty('--show-unlock', 0);
  }
}

UNLOCK.addEventListener('click', UNLOCK_SAFE)

let watcherID

const getHunting = () => {
  CHEST.removeEventListener('transitionend', getHunting)
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(UPDATE, () => {}, {
      enableHighAccuracy: true,
    });
    watcherID = navigator.geolocation.watchPosition(UPDATE, () => {}, {
      enableHighAccuracy: true,
    })
  }
}

const START = () => {
  BUTTON.remove()
  CHEST_WRAPPER.style.opacity = 1
  UNLOCK.style.display = 'block'
  navigator.vibrate([1000])
  AUDIO.SLAM.currentTime = 0
  AUDIO.SLAM.play()
  CHEST.addEventListener('transitionend', getHunting)
  CHEST.style.setProperty('--flight', 0)
  SHADOW.style.setProperty('--o', 1)
}
BUTTON.addEventListener('click', START)

// Then it's a case of making a square wobble the closer we get to it by updating a speed animation.


