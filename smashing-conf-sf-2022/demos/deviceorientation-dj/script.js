import gsap from 'gsap'

const LIMIT = 0.2
const VOLUME_TOGGLE = document.querySelector('.audio-toggle')
const START_BUTTON = document.querySelector('.start')
const INTRO = document.querySelector('.intro')
const INTRO_CONTAINER = document.querySelector('.intro-container')

const TRACK = new Audio(
	new URL('../../../assets/instrumental.mp3', import.meta.url)
)
TRACK.loop = true
TRACK.muted = false

const toggleMute = () => {
	VOLUME_TOGGLE.setAttribute(
		'aria-pressed',
		VOLUME_TOGGLE.matches('[aria-pressed="true"]') ? false : true
	)
	TRACK.muted = !TRACK.muted
	if (!TRACK.muted) TRACK.play()
}

const genRate = (s) => {
	let rate = 1
	const val = gsap.utils.clamp(-LIMIT, LIMIT, s)
	rate = gsap.utils.mapRange(-LIMIT, LIMIT, -LIMIT, LIMIT)(val)
	return rate
}

// Hook this up to device orientation instead of ScrollTrigger
// ScrollTrigger.create({
//   trigger: 'body',
//   start: 1,
//   end: 'bottom bottom',
//   onLeaveBack: () => (document.documentElement.scrollTop = document.body.scrollHeight - 2),
//   onLeave: () => (document.documentElement.scrollTop = 2),
//   onUpdate: self => {
//     faceSwap(true)
//     const speed = self.getVelocity() / 1000
//     const rate = genRate(speed)
//     new timeline()
//       .fromTo(currentTrack, { currentTime: currentTrack.currentTime < rate ? currentTrack.duration - (rate- currentTrack.currentTime) : currentTrack.currentTime + rate }, { playbackRate: 1 }, 0)
//       .fromTo(TL, { timeScale: speed }, { timeScale: 1 }, 0)
//     if (timer) timer.kill()
//     timer = delayedCall(0.2, () => faceSwap(false))
//   },
// })

let currentRotation
let currentScratch
let scratchEnabled
const FLAT_THRESHOLD = 20
const handleOrientation = ({ alpha, beta }) => {
	currentRotation = Math.round(beta)
	currentScratch = Math.round(alpha)
	if (currentRotation <= FLAT_THRESHOLD && currentRotation >= -FLAT_THRESHOLD) {
		scratchEnabled = true
	} else {
		scratchEnabled = false
	}
	if (!scratchEnabled)
		console.warn('You are outside the scratch zone. Get that phone flat!')
}

let timer
const faceSwap = spinning => {
  gsap.set('.face', { display: spinning ? 'none' : 'block' })
  gsap.set('.face--nauseous', { display: spinning ? 'block' : 'none' })
}

const EYES = document.querySelector('.eyes--open')
const blink = EYES => {
  gsap.set(EYES, { scaleY: 1 })
  if (EYES.BLINK_TL) EYES.BLINK_TL.kill()
  EYES.BLINK_TL = gsap.timeline({
    delay: Math.floor(Math.random() * 5) + 1,
    onComplete: () => blink(EYES),
  })
  EYES.BLINK_TL.to(EYES, {
    duration: 0.05,
    transformOrigin: '50% 50%',
    scaleY: 0,
    yoyo: true,
    repeat: 1,
  })
}
blink(EYES)


gsap.set('.record', { transformOrigin: '50% 50%' })  
gsap.set('.record__shine', { transformOrigin: '50% 50%', rotate: 55 })
const TL = gsap.timeline({ repeat: -1, paused: true })
  .to(
    '.record',
    {
      rotate: 360,
      duration: 1,
      ease: 'none',
    },
    0
  )
  .to(
    '.record',
    {
      transformOrigin: '49.5% 50%',
      repeat: 1,
      yoyo: true,
      duration: 0.5,
    },
    0
  )
  .to(
    '.record__shine',
    {
      transformOrigin: '49.5% 50%',
      repeat: 1,
      yoyo: true,
      duration: 0.5,
    },
    0
  )
  .to(
    '.record__shine',
    {
      rotate: '+=4',
      repeat: 1,
      yoyo: true,
      duration: 0.5,
      ease: 'none',
    },
    0
  )


const handleMotion = ({ rotationRate: { alpha } }) => {
	const velocity = Math.round(alpha) / 10
	if (Math.abs(velocity) > 5) {
		// Not pixels per second but instead degrees per second? Rotation Rate?
		// Sooo velocity === degrees per second
		faceSwap(true)
		const speed = gsap.utils.clamp(-20, 20, velocity)
		const rate = genRate(speed)
		gsap.timeline().fromTo(
			TRACK,
			{
				currentTime:
					TRACK.currentTime < rate
						? TRACK.duration - (rate - TRACK.currentTime)
						: TRACK.currentTime + rate,
			},
			{ playbackRate: 1 },
			0
		)
		.fromTo(TL, { timeScale: speed }, { timeScale: 1 }, 0)
		if (timer) timer.kill()
    timer = gsap.delayedCall(0.2, () => faceSwap(false))
	}
}

const START = () => {
	INTRO_CONTAINER.remove()
	TRACK.play()
	TL.play()
	navigator.vibrate([1000])
	if (
		DeviceOrientationEvent?.requestPermission &&
		DeviceMotionEvent?.requestPermission
	) {
		Promise.all([
			DeviceOrientationEvent.requestPermission(),
			DeviceMotionEvent.requestPermission(),
		]).then((results) => {
			if (results.every((result) => result === 'granted')) {
				window.addEventListener('deviceorientation', handleOrientation)
				window.addEventListener('devicemotion', handleMotion, true)
			} else {
				console.info('You denied permission to play at the venue!')
			}
		})
	} else {
		window.addEventListener('deviceorientation', handleOrientation)
		window.addEventListener('devicemotion', handleMotion, true)
	}
}

// BUTTON.addEventListener('click', START)

START_BUTTON.addEventListener('click', START)
VOLUME_TOGGLE.addEventListener('click', () => {
	toggleMute()
})

// const {
//   gsap,
//   ScrollTrigger,
//   gsap: { timeline, set, to, delayedCall },
// } = window

// gsap.registerPlugin(ScrollTrigger)

// // Utility function - h/t to https://www.trysmudford.com/blog/linear-interpolation-functions/
// const LERP = (x, y, a) => x * (1 - a) + y * a
// const CLAMP = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a))
// const INVLERP = (x, y, a) => CLAMP((a - x) / (y - x))
// const RANGE = (x1, y1, x2, y2, a) => LERP(x2, y2, INVLERP(x1, y1, a))

// const VOLUME_TOGGLE = document.querySelector('input')
// const EYES = document.querySelector('.eyes--open')
// const LIMIT = 0.2

// const TRACKS = {
//   // Forest by Yakov Golman(https://freemusicarchive.org/music/Yakov_Golman/Piano__orchestra_1/Yakov_Golman_-_Forest_1236) is licensed under a Attribution License: http://creativecommons.org/licenses/by/4.0/
//   CLASSICAL: {
//     TRACK: new Audio(
//       'https://assets.codepen.io/605876/yakov-golman-forest-classic.mp3'
//     ),
//     HUE: 40,
//   },
//   // Born Ready by Flex Vector(https://freemusicarchive.org/music/Flex_Vector/20190131191544588/Flex_Vector_-_Born_Ready_1591) is licensed under a Attribution-NonCommercial-ShareAlike License: http://creativecommons.org/licenses/by-nc-sa/4.0/
//   INSTRUMENTAL: {
//     TRACK: new Audio(
//       'https://assets.codepen.io/605876/flex-vector-bord-ready-instrumental.mp3'
//     ),
//     HUE: 160,
//   },
//   // Spencer - Bluegrass (ID 1230) by Lobo Loco(https://freemusicarchive.org/music/Lobo_Loco/Salad_Mixed/Spencer_-_Bluegrass_ID_1230) is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 License: http://creativecommons.org/licenses/by-nc-nd/4.0/
//   BLUES: {
//     TRACK: new Audio(
//       'https://assets.codepen.io/605876/lobo-loco-spencer-bluegrass-blues.mp3'
//     ),
//     HUE: 190,
//   },
//   // Rainbow by Chad Crouch(https://freemusicarchive.org/music/Chad_Crouch/Motion/Rainbow_1648) is licensed under a Attribution-NonCommercial 3.0 International License: http://creativecommons.org/licenses/by-nc/3.0/
//   POP: {
//     TRACK: new Audio(
//       'https://assets.codepen.io/605876/chad-crouch-rainbow-pop.mp3'
//     ),
//     HUE: 320,
//   },
//   // Magic by Yung Kartz(https://freemusicarchive.org/music/Yung_Kartz/July_2019/Magic) is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 License: http://creativecommons.org/licenses/by-nc-nd/4.0/
//   HIPHOP: {
//     TRACK: new Audio(
//       'https://assets.codepen.io/605876/yung-kartz-magic-hiphop.mp3'
//     ),
//     HUE: 280,
//   },
//   // Story has Begun (Kielokaz 156) by KieLoKaz(https://freemusicarchive.org/music/KieLoKaz/Walker_Traffic/Story_has_Begun_Kielokaz_156) is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 License: http://creativecommons.org/licenses/by-nc-nd/4.0/
//   JAZZ: {
//     TRACK: new Audio(
//       'https://assets.codepen.io/605876/kielokaz-story-has-begun-jazz.mp3'
//     ),
//     HUE: 220,
//   },
// }

// let currentTrack = TRACKS.INSTRUMENTAL.TRACK

// const faceSwap = spinning => {
//   set('.face', { display: spinning ? 'none' : 'block' })
//   set('.face--nauseous', { display: spinning ? 'block' : 'none' })
// }
// let timer

// for (let genre of Object.keys(TRACKS)) {
//   TRACKS[genre].TRACK.loop = true
//   TRACKS[genre].TRACK.muted = true
//   TRACKS[genre].TRACK.volume = 1
// }

// const toggleMute = () => {
//   const MUTE = !TRACKS.CLASSICAL.TRACK.muted
//   for (let genre of Object.keys(TRACKS)) {
//     TRACKS[genre].TRACK.muted = MUTE
//   }
// }

// const genRate = s => {
//   let rate = 1
//   const val = CLAMP(s, -LIMIT, LIMIT)
//   // if (val < 0) rate = RANGE(-5, 0, 0.5, 1, val)
//   // else rate = RANGE(0, 5, 1, 4, val)
//   rate = RANGE(-LIMIT, LIMIT, -LIMIT, LIMIT, val)
//   return rate
// }

// set('.record', { transformOrigin: '50% 50%' })
// set('.player-arm', { transformOrigin: '25% 15%', rotate: 25 })
// to('.player-arm', { duration: 0.5, rotate: 26, repeat: -1, yoyo: true })

// const TL = timeline({ repeat: -1 })
//   .to(
//     '.record',
//     {
//       rotate: 360,
//       duration: 1,
//       ease: 'none',
//     },
//     0
//   )
//   .to(
//     '.record',
//     {
//       transformOrigin: '49.5% 50%',
//       repeat: 1,
//       yoyo: true,
//       duration: 0.5,
//     },
//     0
//   )
//   .to(
//     '.record__shine',
//     {
//       transformOrigin: '49.5% 50%',
//       repeat: 1,
//       yoyo: true,
//       duration: 0.5,
//     },
//     0
//   )
//   .to(
//     '.record__shine',
//     {
//       rotate: '+=4',
//       repeat: 1,
//       yoyo: true,
//       duration: 0.5,
//       ease: 'none',
//     },
//     0
//   )
// set('.record__shine', { transformOrigin: '50% 50%', rotate: 55 })
// set(['.record-player', '.genre-switch'], { display: 'block' })

// document.documentElement.scrollTop = 2
// ScrollTrigger.create({
//   trigger: 'body',
//   start: 1,
//   end: 'bottom bottom',
//   onLeaveBack: () => (document.documentElement.scrollTop = document.body.scrollHeight - 2),
//   onLeave: () => (document.documentElement.scrollTop = 2),
//   onUpdate: self => {
//     faceSwap(true)
//     const speed = self.getVelocity() / 1000
//     const rate = genRate(speed)
//     new timeline()
//       .fromTo(currentTrack, { currentTime: currentTrack.currentTime < rate ? currentTrack.duration - (rate- currentTrack.currentTime) : currentTrack.currentTime + rate }, { playbackRate: 1 }, 0)
//       .fromTo(TL, { timeScale: speed }, { timeScale: 1 }, 0)
//     if (timer) timer.kill()
//     timer = delayedCall(0.2, () => faceSwap(false))
//   },
// })

// const blink = EYES => {
//   gsap.set(EYES, { scaleY: 1 })
//   if (EYES.BLINK_TL) EYES.BLINK_TL.kill()
//   EYES.BLINK_TL = timeline({
//     delay: Math.floor(Math.random() * 5) + 1,
//     onComplete: () => blink(EYES),
//   })
//   EYES.BLINK_TL.to(EYES, {
//     duration: 0.05,
//     transformOrigin: '50% 50%',
//     scaleY: 0,
//     yoyo: true,
//     repeat: 1,
//   })
// }
// blink(EYES)

// VOLUME_TOGGLE.addEventListener('input', () => {
//   toggleMute()
//   currentTrack.play()
//   // currentTrack = TRACKS.CLASSIC.TRACK
// })
// const GENRE_SWITCH = document.querySelector('select')
// GENRE_SWITCH.addEventListener('change', () => {
//   currentTrack.pause()
//   document.documentElement.style.setProperty(
//     '--hue',
//     TRACKS[GENRE_SWITCH.value].HUE
//   )
//   currentTrack = TRACKS[GENRE_SWITCH.value].TRACK
//   currentTrack.play()
// })
