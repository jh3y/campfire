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
		const handleDragStart =
			({ piece, px, py, sx, sy }) =>
			(e) => {
				// this._clone = piece.cloneNode(true)
				// this._clone.classList.add('captcha__piece--clone')
				// this._grid.appendChild(this._clone)
				piece.style.opacity = 0.25
				e.dataTransfer.setData('text/json', JSON.stringify({ px, py, sx, sy }))
			}
		
		const handleDragEnd = (piece) => () => {
			piece.style.opacity = 1
		}
		const doNothing = (e) => {
			e.preventDefault()
		}
		const handleDrop =
			({ piece, slot, px, py, sx, sy }) =>
			(e) => {
				e.stopPropagation()
				e.preventDefault()
				const transferred = JSON.parse(e.dataTransfer.getData('text/json'))
				if (
					transferred.sx === sx &&
					transferred.sy === sy &&
					transferred.px === px &&
					transferred.py === py
				) {
					// It's a match
					piece.remove()
					slot.remove()
					this._progress++
					// this._element.style.setProperty('--progress', (this._progress / this._options.pieces) * 100)
					if (this._progress === this._options.pieces && this._options.onComplete) this._options.onComplete() 
				} else {
					this._clone.remove()
				}
			}
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

			// Do the event binding here
			piece.addEventListener(
				'dragstart',
				handleDragStart({ piece, px, py, sx, sy })
			)
			piece.addEventListener('dragend', handleDragEnd(piece))
			slot.addEventListener('dragover', doNothing)
			slot.addEventListener('dragenter', doNothing)
			slot.addEventListener('dragleave', doNothing)
			// slot.addEventListener('drop', handleDrop({ piece, slot, px, py, sx, sy }))
		}
	}

	setup() {
		this.generatePieces()
		this.createPieces()
	}
}

new Captcha({ pieces: 3, element: document.querySelector('.captcha') })
