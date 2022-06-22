import confetti from 'canvas-confetti'

const {
  speechSynthesis: synth,
} = window

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition

let BROTHER

const AUDIO = {
  // CHEER: new Audio(new URL('../../../assets/grunt-party--optimised.mp3', import.meta.url)),
  POP: new Audio(new URL('../../../assets/grunt-party--optimised.mp3', import.meta.url)),
}

const STATE = {
  RUNNING: false,
  ACTIVE: false,
}

const SPEAK = text => {
  if (synth.speaking) synth.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.voice = synth.getVoices().filter(v => v.name === 'Google UK English Male')[0]
  synth.speak(utter)
}

const ON_END = () => {
  console.info('ended?')
  // We may have ended on an error or unintentionally
  if (STATE.RUNNING && BROTHER) {
    CLEAN_UP()
    genProcessor()
  }
}


const INDICATE_START = () => {
  if (!STATE.RUNNING) {
    console.info('starting recording neat...')
    STATE.RUNNING = true
    document.documentElement.style.setProperty('--recording', 1)
  } 
}

let deactivateTimer
let slide = 0
const TIMER = 5000
const KEY_PHRASE = "Hey Phil"

const DEACTIVATE = () => {
  STATE.ACTIVE = false
  document.body.style.setProperty('--active', 0)
}

const PHRASES = {
  LIGHTS: 'turn the lights',
  HUE: 'change hue to',
  SATURATION: 'change saturation to',
  LIGHTNESS: 'change lightness to',
  SLIDE: 'slide to the',
  TIME: 'what time is it',
  DONE: 'we did it',
  SAY: 'say',
}

const ACTIONS = [
  {
    phrase: PHRASES.LIGHTS,
    action: transcript => {
      const STATE_TRANSCRIPT = transcript.slice(transcript.indexOf(PHRASES.LIGHTS) + PHRASES.LIGHTS.length).trim()
      if (STATE_TRANSCRIPT.startsWith('on')) {
        document.documentElement.className = 'lights-on'
      } 
      if (STATE_TRANSCRIPT.startsWith('off')) {
        document.documentElement.className = 'lights-off'
      }
      if (deactivateTimer !== undefined) clearTimeout(deactivateTimer)
      DEACTIVATE()
      SPEAK(`Sure! Turning lights ${STATE_TRANSCRIPT.startsWith('on') ? 'On' : 'Off'}`)
    }
  },
  {
    phrase: PHRASES.HUE,
    action: transcript => {
      const HUE = parseInt(transcript.slice(transcript.indexOf(PHRASES.HUE) + PHRASES.HUE.length).trim(), 10)
      document.documentElement.style.setProperty('--hue', HUE)
      if (deactivateTimer !== undefined) clearTimeout(deactivateTimer)
      DEACTIVATE()
      SPEAK(`Sure! Changing hue to ${HUE}`)
    }
  },
  {
    phrase: PHRASES.SAY,
    action: transcript => {
      if (deactivateTimer !== undefined) clearTimeout(deactivateTimer)
      if (transcript.startsWith("say")) {
        const MSG = transcript.slice(transcript.indexOf(PHRASES.SAY) + PHRASES.SAY.length).trim()
        SPEAK(MSG)
        console.info(MSG)
        if (MSG.toLowerCase().indexOf('bye phil') !== -1 || MSG.toLowerCase().indexOf('by phil') !== -1 || MSG.toLowerCase().indexOf('by fill') !== -1) {
          setTimeout(() => {
            DEACTIVATE()
            confetti()
            AUDIO.POP.play()
          }, 2000)
        }
      }
    }
  },
  {
    phrase: PHRASES.TIME,
    action: transcript => {
      if (deactivateTimer !== undefined) clearTimeout(deactivateTimer)
      DEACTIVATE()
      SPEAK(`The time is ${Date.now()}`)
    }
  },
  {
    phrase: PHRASES.DONE,
    action: transcript => {
      if (deactivateTimer !== undefined) clearTimeout(deactivateTimer)
      SPEAK('Yay...')
      setTimeout(() => {
        DEACTIVATE()
        confetti()
        AUDIO.POP.play()
      }, 2000)
      // AUDIO.CHEER.play()
    }
  },
  {
    phrase: PHRASES.SLIDE,
    action: transcript => {
      const STATE_TRANSCRIPT = transcript.slice(transcript.indexOf(PHRASES.SLIDE) + PHRASES.SLIDE.length).trim()
      if (STATE_TRANSCRIPT.startsWith('left')) slide--
      if (STATE_TRANSCRIPT.startsWith('right')) slide++
      document.documentElement.style.setProperty('--slide', slide)
      if (deactivateTimer !== undefined) clearTimeout(deactivateTimer)
      DEACTIVATE()
      SPEAK(`Sure! Sliding to the ${STATE_TRANSCRIPT.startsWith('left') ? 'left' : 'right'}`)
    }
  },
  {
    phrase: PHRASES.SATURATION,
    action: transcript => {
      const SATURATION = parseInt(transcript.slice(transcript.indexOf(PHRASES.SATURATION) + PHRASES.SATURATION.length).trim(), 10)
      document.documentElement.style.setProperty('--saturation', SATURATION)
      if (deactivateTimer !== undefined) clearTimeout(deactivateTimer)
      DEACTIVATE()
      SPEAK(`Sure! Changing saturation to ${SATURATION}`)
    }
  },
  {
    phrase: PHRASES.LIGHTNESS,
    action: transcript => {
      const LIGHTNESS = parseInt(transcript.slice(transcript.indexOf(PHRASES.LIGHTNESS) + PHRASES.LIGHTNESS.length).trim(), 10)
      document.documentElement.style.setProperty('--lightness', LIGHTNESS)
      if (deactivateTimer !== undefined) clearTimeout(deactivateTimer)
      DEACTIVATE()
      SPEAK(`Sure! Changing lightness to ${LIGHTNESS}`)
    }
  }
]

const PROCESS_AUDIO = e => {
  const TRANSCRIPT = e.results[e.results.length - 1][0].transcript.toLowerCase().trim()
  const IS_FINAL = e.results[e.results.length - 1].isFinal
  if (IS_FINAL) console.info('processing:', TRANSCRIPT)
  if (STATE.ACTIVE && IS_FINAL && TRANSCRIPT !== KEY_PHRASE.toLowerCase().trim()) {
    let fired = false
    for (const ACTION of ACTIONS) {
      if (TRANSCRIPT.toLowerCase().indexOf(ACTION.phrase.toLowerCase()) !== -1) {
        fired = true
        ACTION.action(TRANSCRIPT)
      }
    }
    if (!fired) {
      SPEAK('Time for a biscuit?!')
      DEACTIVATE()
    }
  } else if (STATE.ACTIVE && !IS_FINAL) {
    if (deactivateTimer !== undefined) clearTimeout(deactivateTimer)
    deactivateTimer = setTimeout(DEACTIVATE, TIMER)
  } else if (TRANSCRIPT === KEY_PHRASE.toLowerCase().trim()) {
    STATE.ACTIVE = true
    document.body.style.setProperty('--active', 1)
    deactivateTimer = setTimeout(DEACTIVATE, TIMER)
  }
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

genProcessor(true)