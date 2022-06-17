import Reveal from 'reveal.js'
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js'
import RevealHighlight from 'reveal.js/plugin/highlight/highlight.esm.js'
import Splitting from 'splitting'

let deck = new Reveal({
	plugins: [Markdown, RevealHighlight],
	hash: true,
})

deck.initialize().then(() => {
	document.querySelectorAll('iframe').forEach(iframe => iframe.setAttribute('allow', 'accelerometer; camera; encrypted-media; display-capture; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write;'))
	document.querySelectorAll('iframe').forEach(iframe => iframe.setAttribute('sandbox', 'allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation'))
	Splitting()
})

deck.on('slidechanged', () => {
	document.querySelectorAll('iframe').forEach(iframe => iframe.setAttribute('allow', 'accelerometer; camera; encrypted-media; display-capture; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write;'))
	document.querySelectorAll('iframe').forEach(iframe => iframe.setAttribute('sandbox', 'allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation'))
})
