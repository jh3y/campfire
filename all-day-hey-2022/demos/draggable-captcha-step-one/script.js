// Polyfill that sucka! But why is it necessary?!!!
window.MobileDragDrop.polyfill()

class Captcha {
	static defaults = {
		gridSize: 5,
		// image: 'https://source.unsplash.com/random/720x720?moon',
		// image: 'https://images.unsplash.com/photo-1499578124509-1611b77778c8?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=720&ixid=MnwxfDB8MXxyYW5kb218MHx8bW9vbnx8fHx8fDE2NTA3MzA3MzM&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=720',
		image: new URL('../../../assets/moon.jpeg', import.meta.url),
		pieces: 4,
		onComplete: () => console.info('captcha: You are not a robot?')
	}

	constructor(options) {
		const opts = (this._options = { ...Captcha.defaults, ...options })
		this._element = opts.element
		this._progress = 0
		this._grid = opts.element.querySelector('.captcha__grid')
		this._img = opts.element.querySelector('.captcha__img')
		if (!this._element || !this._img || !this._grid)
			throw Error('Captcha: Required elements missing!')
		if (opts.pieces > Math.pow(opts.gridSize, 2))
			throw Error('Captcha: Can not have more pieces than available')
		// Set CSS inline custom properties
		this._element.style.setProperty('--captcha-image', `url(${opts.image})`)
		this._element.style.setProperty('--captcha-grid-size', opts.gridSize)
		// Now set up the moveable pieces
		this.setup()
	}

	generatePieces() {
		const pieces = []
		const generatePiece = () => {
			// Create an Array of two items. One is zero or the length.
			// The other is the gap inbetween.
			// Flip a coin to reverse and return the Array.
			const positions = [
				// This can either be the start or the finish
				Math.random() > 0.5 ? -2 : 1,
				// This can be 3, 4, 5, or 6. Gutter is 2
				Math.floor(Math.random() * (this._options.gridSize - 1)) + 3,
			]
			const segment = Math.floor(
				Math.random() * Math.pow(this._options.gridSize, 2)
			)
			const segments = [
				segment % this._options.gridSize,
				Math.floor(segment / this._options.gridSize),
			]
			return {
				positions: Math.random() > 0.5 ? positions.reverse() : positions,
				segments,
			}
		}
		while (pieces.length !== this._options.pieces) {
			const pushPiece = () => {
				const newPiece = generatePiece()
				const alreadyExists = pieces.filter(
					({ positions: [px, py], segments: [sx, sy] }) =>
						(px === newPiece.positions[0] && py === newPiece.positions[1]) ||
						(sx === newPiece.segments[0] && sy === newPiece.segments[1])
				).length
				if (alreadyExists) pushPiece()
				else pieces.push(newPiece)
			}
			pushPiece()
		}
		this._pieces = pieces
	}

	createPieces() {
		for (const {
			positions: [px, py],
			segments: [sx, sy],
		} of this._pieces) {
			const piece = document.createElement('div')
			piece.className = 'captcha__piece'
			piece.setAttribute('draggable', true)
			piece.style.setProperty('--captcha-x', px)
			piece.style.setProperty('--captcha-y', py)

			const slot = document.createElement('div')
			slot.className = 'captcha__slot'
			slot.style.setProperty('--segment-x', sx + 3)
			slot.style.setProperty('--segment-y', sy + 3)
			// Needs to be able to show the correct image
			piece.style.setProperty('--segment-x', -sx)
			piece.style.setProperty('--segment-y', -sy)
			this._grid.appendChild(piece)
			this._grid.appendChild(slot)

		}
	}

	setup() {
		this.generatePieces()
		this.createPieces()
	}
}

new Captcha({ pieces: 3, element: document.querySelector('.captcha') })
