window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition

const RECOG = new window.SpeechRecognition()
RECOG.continuous = true
// RECOG.lang = 'en-US'
// Continous results or not
RECOG.interimResults = true


const STATE = {
  RUNNING: false,
}

const START = () => {
  if (!STATE.RUNNING) {
    console.info('starting recording neat...')
    STATE.RUNNING = true
    document.body.style.setProperty('--recording', 1)
    RECOG.start()
  }
}

const PROCESS_AUDIO = e => {
  const TRANSCRIPT = e.results[e.results.length - 1][0].transcript
    .toLowerCase()
    .trim()
  document.querySelector('main').innerText = TRANSCRIPT
}

RECOG.onresult = PROCESS_AUDIO

// RECOG.onend = () => {
//   console.info('Restarting due to error, etc.')
//   // Shouldn't end, restart.
//   // Only restart if state is still running.
//   if (STATE.RUNNING) RECOG.start()
// }

START()