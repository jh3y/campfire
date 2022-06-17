const mapRange = (inputLower, inputUpper, outputLower, outputUpper) => {
  const INPUT_RANGE = inputUpper - inputLower
  const OUTPUT_RANGE = outputUpper - outputLower
  return value => outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
}
const CLAMP = (num, min, max) => Math.min(Math.max(num, min), max);

const LABEL = document.querySelector('.debug-label')
const UNLOCK = document.querySelector('.unlock')

const REVEAL_THRESHOLD = 85

const UNLOCK_SOUND = new Audio(new URL('../../../assets/zelda-chest.mp3', import.meta.url))

/*
  * Geolocation Mapper based on prelogged coordinates
*/

// The last log entry signals what we're trying to find.
const LOG = [
  {
    lat: 52.1539492,
    long: -0.4564003
  },
  {
    lat: 52.1539337,
    long: -0.4563751
  },
  {
    lat: 52.1539295,
    long: -0.4563920
  },
  {
    lat: 52.1539303,
    long: -0.4563903
  }
]
const PRIZE = {
  lat: 52.1539311,
  long: -0.4563863
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

const UNLOCK_SAFE = () => {
  document.documentElement.style.setProperty('--show-unlock', 0)
  document.documentElement.style.setProperty('--hunting', 0)
  UNLOCK_SOUND.play()
}

console.info({ COMPOSED, DISTANCES, MAX: Math.max(...DISTANCES) })

// Now this should map to some form of square or area and we can get a rough idea of the distance between points, right?
// Then divide that by a scale we like.

const WOBBLE_MAPPER = mapRange(0, Math.max(...DISTANCES), 100, 0)

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
  document.documentElement.style.setProperty('--proximity', PROXIMITY)
  // Log the coordinates
  LABEL.innerText = JSON.stringify(
    {
      accuracy,
      altitude,
      altitudeAccuracy,
      latitude,
      heading,
      longitude,
      speed,
      distance: DISTANCE,
      proximity: PROXIMITY,
    },
    undefined,
    2
  );

  if (PROXIMITY >= REVEAL_THRESHOLD) {
    document.documentElement.style.setProperty('--show-unlock', 1);
  } else {
    document.documentElement.style.setProperty('--show-unlock', 0);
  }
}

UNLOCK.addEventListener('click', UNLOCK_SAFE)

let watcherID
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(UPDATE, () => {}, {
    enableHighAccuracy: true,
  });
  watcherID = navigator.geolocation.watchPosition(UPDATE, () => {}, {
    enableHighAccuracy: true,
  })
}
// Then it's a case of making a square wobble the closer we get to it by updating a speed animation.


