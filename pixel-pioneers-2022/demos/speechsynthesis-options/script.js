const {
  speechSynthesis: synth,
} = window

const SELECT = document.querySelector('#voice')
const MESSAGE = document.querySelector('#message')

const START = () => {
  const VOICES = speechSynthesis.getVoices()
  console.info(VOICES)
  VOICES.forEach(voice => {
    const OPTION = document.createElement('option')
    OPTION.value = voice.voiceURI
    OPTION.innerText = voice.name
    SELECT.appendChild(OPTION)
  })
}

const speak = text => {
  if (synth.speaking) synth.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  console.info(SELECT.value)
  utter.voice = synth.getVoices().filter(v => v.name === SELECT.value)[0]
  synth.speak(utter)
}

const BUTTON = document.querySelector('button')

const SPEAK_UP = () => speak(MESSAGE.value || 'Hey!')
BUTTON.addEventListener('click', SPEAK_UP)

if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = START;
}