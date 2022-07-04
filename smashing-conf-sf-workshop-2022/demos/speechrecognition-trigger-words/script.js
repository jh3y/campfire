window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition

const BUTTON = document.querySelector('button')
const MUTE_TOGGLE = document.querySelector('.mute-toggle')


let BROTHER

const STATE = {
  RUNNING: false,
  ACTIVE: false,
}

const ON_END = () => {
  // We may have ended on an error or unintentionally
  if (STATE.RUNNING && BROTHER) BROTHER.start()
}


const INDICATE_START = () => {
  if (!STATE.RUNNING) {
    console.info('starting recording neat...')
    STATE.RUNNING = true
    document.documentElement.style.setProperty('--text', 'var(--gray-0)')
    document.querySelector('main').innerHTML = '<span class="instruction">Say "Hey Smashing"!</span>'
    document.documentElement.style.setProperty('--recording', 1)
  } 
}

let deactiveTimer
const TIMER = 5000
const KEY_PHRASE = "Hey Smashing"

const DEACTIVATE = () => {
  STATE.ACTIVE = false
  document.body.style.setProperty('--text', 'var(--adaptive)')
}

const PHRASES = {
  LIGHTS: 'turn the lights',
  HUE: 'change hue to',
  SATURATION: 'change saturation to',
  LIGHTNESS: 'change lightness to',
}

const ACTIONS = [
  {
    phrase: PHRASES.LIGHTS,
    action: transcript => {
      const STATE_TRANSCRIPT = transcript.slice(transcript.indexOf(PHRASES.LIGHTS) + PHRASES.LIGHTS.length).trim()
      if (STATE_TRANSCRIPT.startsWith('on')) document.documentElement.className = 'lights-on'
      if (STATE_TRANSCRIPT.startsWith('off')) document.documentElement.className = 'lights-off'
    }
  },
  {
    phrase: PHRASES.HUE,
    action: transcript => {
      const HUE = parseInt(transcript.slice(transcript.indexOf(PHRASES.HUE) + PHRASES.HUE.length).trim(), 10)
      document.documentElement.style.setProperty('--hue', HUE)
      clearTimeout(deactivateTimer)
      DEACTIVATE()
    }
  },
  {
    phrase: PHRASES.SATURATION,
    action: transcript => {
      const SATURATION = parseInt(transcript.slice(transcript.indexOf(PHRASES.SATURATION) + PHRASES.SATURATION.length).trim(), 10)
      document.documentElement.style.setProperty('--saturation', SATURATION)
      clearTimeout(deactivateTimer)
      DEACTIVATE()
    }
  },
  {
    phrase: PHRASES.LIGHTNESS,
    action: transcript => {
      const LIGHTNESS = parseInt(transcript.slice(transcript.indexOf(PHRASES.LIGHTNESS) + PHRASES.LIGHTNESS.length).trim(), 10)
      document.documentElement.style.setProperty('--lightness', LIGHTNESS)
      clearTimeout(deactivateTimer)
      DEACTIVATE()
    }
  }
]

const PROCESS_AUDIO = e => {
  const TRANSCRIPT = e.results[e.results.length - 1][0].transcript
  const IS_FINAL = e.results[e.results.length - 1].isFinal
  if (STATE.ACTIVE && IS_FINAL) {
    for (const ACTION of ACTIONS) {
      if (TRANSCRIPT.toLowerCase().indexOf(ACTION.phrase.toLowerCase()) !== -1) ACTION.action(TRANSCRIPT)
    }
  } else if (STATE.ACTIVE && !IS_FINAL) {
    clearTimeout(deactivateTimer)
    deactivateTimer = setTimeout(DEACTIVATE, TIMER)
  } else if (TRANSCRIPT.toLowerCase().trim() === KEY_PHRASE.toLowerCase().trim()) {
    STATE.ACTIVE = true
    document.body.style.setProperty('--text', 'var(--green-4)')
    deactivateTimer = setTimeout(DEACTIVATE, TIMER)
  }
  document.documentElement.style.setProperty('--text', IS_FINAL ? 'var(--blue-4)' : 'var(--adaptive)')
  document.querySelector('main').innerText = TRANSCRIPT.toLowerCase().trim()
}

const CLEAN_UP = () => {
  BROTHER.stop()
  BROTHER.removeEventListener('start', INDICATE_START)
  BROTHER.removeEventListener('result', PROCESS_AUDIO)
  BROTHER.removeEventListener('end', ON_END)
}

const genProcessor = (interim) => {
  BROTHER = new window.SpeechRecognition()
  BROTHER.continuous = true
  BROTHER.interimResults = interim
  BROTHER.addEventListener('start', INDICATE_START)
  BROTHER.addEventListener('result', PROCESS_AUDIO)
  BROTHER.addEventListener('end', ON_END)
  BROTHER.start()
}


MUTE_TOGGLE.addEventListener('click', () => {
  const PRESSED = MUTE_TOGGLE.matches('[aria-pressed="false"]') ? true : false
  if (BROTHER && PRESSED) {
    console.info('stopping recording')
    STATE.RUNNING = false
    CLEAN_UP()
    document.documentElement.style.setProperty('--text', 'var(--adaptive)')
    document.querySelector('main').innerHTML = '<span class="instruction">Brother is not listening...</span>'
    document.documentElement.style.setProperty('--recording', 0)
  } else genProcessor(BUTTON.matches('[aria-pressed="false"]') ? true : false)
  MUTE_TOGGLE.setAttribute('aria-pressed', PRESSED)
})

BUTTON.addEventListener('click', () => {
  const PRESSED = BUTTON.matches('[aria-pressed="false"]') ? true : false
  if (BROTHER) CLEAN_UP()
  BUTTON.setAttribute('aria-pressed', PRESSED)
  const MUTED = MUTE_TOGGLE.matches('[aria-pressed="false"]') ? true : false
  if (!MUTED) genProcessor(PRESSED)
})


genProcessor(true)