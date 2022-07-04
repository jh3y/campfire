window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition

const BUTTON = document.querySelector('button')

let BROTHER
const genProcessor = (interim) => {
  BROTHER = new window.SpeechRecognition()
  BROTHER.continuous = true
  BROTHER.interimResults = interim
  BROTHER.addEventListener('start', INDICATE_START)
  BROTHER.addEventListener('result', PROCESS_AUDIO)
  BROTHER.start()
}

const STATE = {
  RUNNING: false,
}

const INDICATE_START = () => {
  if (!STATE.RUNNING) {
    console.info('starting recording neat...')
    STATE.RUNNING = true
    document.body.style.setProperty('--recording', 1)
  } 
}

const PROCESS_AUDIO = e => {
  console.info('processing', e)
  const transcript = e.results[e.results.length - 1][0].transcript
  const isFinal = e.results[e.results.length - 1].isFinal
  document.documentElement.style.setProperty('--text', isFinal ? 'var(--green-4)' : 'var(--gray-0)')
  document.querySelector('main').innerText = transcript.toLowerCase().trim()
}

// RECOG.onend = () => {
//   console.info('Restarting due to error, etc.')
//   // Shouldn't end, restart.
//   // Only restart if state is still running.
//   if (STATE.RUNNING) RECOG.start()
// }

genProcessor(true)

BUTTON.addEventListener('click', () => {
  const PRESSED = BUTTON.matches('[aria-pressed="false"]') ? true : false
  if (BROTHER) {
    BROTHER.stop()
    BROTHER.removeEventListener('start', INDICATE_START)
    BROTHER.removeEventListener('result', PROCESS_AUDIO)
  }
  BUTTON.setAttribute('aria-pressed', PRESSED)
  genProcessor(PRESSED)
})