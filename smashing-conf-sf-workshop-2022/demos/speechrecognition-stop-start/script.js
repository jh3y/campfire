window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition

const BUTTON = document.querySelector('button')
const MUTE_TOGGLE = document.querySelector('.mute-toggle')


let BROTHER

const STATE = {
  RUNNING: false,
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
    document.querySelector('main').innerHTML = '<span class="instruction">Start Speaking!</span>'
    document.documentElement.style.setProperty('--recording', 1)
  } 
}

const PROCESS_AUDIO = e => {
  console.info('processing', e)
  const transcript = e.results[e.results.length - 1][0].transcript
  const isFinal = e.results[e.results.length - 1].isFinal
  document.documentElement.style.setProperty('--text', isFinal ? 'var(--green-4)' : 'var(--gray-0)')
  document.querySelector('main').innerText = transcript.toLowerCase().trim()
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


genProcessor()