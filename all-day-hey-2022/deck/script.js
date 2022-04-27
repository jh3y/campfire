import Reveal from 'reveal.js'
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js'
import RevealHighlight from 'reveal.js/plugin/highlight/highlight.esm.js'

let deck = new Reveal({
	plugins: [Markdown, RevealHighlight]
})

deck.initialize().then(() => {
	document.querySelectorAll('iframe').forEach(iframe => iframe.setAttribute('allow', 'microphone *'))
})

deck.on('slidechanged', () => {
	document.querySelectorAll('iframe').forEach(iframe => iframe.setAttribute('allow', 'microphone *'))
})
