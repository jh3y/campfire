const {
  speechSynthesis: synth,
} = window

const mirror = (keys, prefix = '', suffix = '') =>
  Object.freeze(
    keys.reduce(
      (obj, key) => ({
        ...obj,
        [`${prefix}${key}${suffix}`]: `${prefix}${key}${suffix}`
      }),
      {}
    )
  );

const speak = text => {
  if (synth.speaking) synth.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.voice = synth.getVoices()[0]
  synth.speak(utter)
}


const BUTTON = document.querySelector('button')

let count = 0

const SPEAK_UP = () => {
	count++
	speak(count > 2 ? 'Jhey, just get on with it...' : 'Here we goooo!')
}

BUTTON.addEventListener('click', SPEAK_UP)
