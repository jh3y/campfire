import gsap from 'gsap'

const H = document.querySelectorAll('h1')
const HEADINGS = [...H, ...H, ...H]

gsap.set(HEADINGS, {
	xPercent: 100,
	transformOrigin: '120% 100%',
})

const TL = gsap.timeline({
	repeat: -1,
})

// TL.timeScale(0.1)

for (let h = 0; h < HEADINGS.length; h++) {
	TL.set(HEADINGS[h + 1], {
		'--t': '100%',
		'--l': 0,
	})
		.to(HEADINGS[h], {
			xPercent: 0,
			opacity: 1,
			duration: 1,
		})
		.to(HEADINGS[h], {
			xPercent: -100,
			duration: 1,
		})
		.to(
			HEADINGS[h + 1],
			{
				xPercent: 0,
				opacity: 1,
				duration: 1,
			},
			'<'
		)
		.to(HEADINGS[h], {
			rotate: 80,
			duration: 1,
		})
		.to(HEADINGS[h], {
			'--l': '100%',
			duration: 1,
		})
		.to(
			HEADINGS[h + 1],
			{
				'--t': 0,
				duration: 1,
			},
			'<'
		)
		.to(HEADINGS[h], {
			opacity: 0,
			duration: 1,
		})
		.set(HEADINGS[h], {
			xPercent: 100,
			rotate: 0,
		})
}

gsap.timeline({ repeat: -1 }).fromTo(
	TL,
	{
		time: 15,
	},
	{ time: 30, duration: 8, ease: 'none' }
)
