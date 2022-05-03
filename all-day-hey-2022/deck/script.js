import Reveal from 'reveal.js'
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js'
import RevealHighlight from 'reveal.js/plugin/highlight/highlight.esm.js'
import Splitting from 'splitting'

let deck = new Reveal({
	plugins: [Markdown, RevealHighlight],
	hash: true,
})

deck.initialize().then(() => {
	document.querySelectorAll('iframe').forEach(iframe => iframe.setAttribute('allow', 'accelerometer *; gyroscope *; microphone *'))
	Splitting()
})

deck.on('slidechanged', () => {
	document.querySelectorAll('iframe').forEach(iframe => iframe.setAttribute('allow', 'accelerometer *; gyroscope *; microphone *'))
})
