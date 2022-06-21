const HEAD = document.querySelector('head')

const ADD_PAGE_TRANSITION_SPEED = (id, speed) => {
  const PAGE_TRANSITION_STUFF = document.createElement('style')
  PAGE_TRANSITION_STUFF.setAttribute('type', 'text/css')
  PAGE_TRANSITION_STUFF.innerText = `::page-transition-container(${id}),::page-transition-outgoing-image(${id}),::page-transition-incoming-image(${id}) {animation-duration: ${speed};}`
  PAGE_TRANSITION_STUFF.innerText += `::page-transition-image-wrapper(${id}) {mix-blend-mode: normal;}`
  HEAD.appendChild(PAGE_TRANSITION_STUFF)
}

ADD_PAGE_TRANSITION_SPEED('box', '0.25s')

const randomInRange = (min, max) =>
  Math.floor(
    Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min)
  )


const BOX = document.querySelector('.box')

const setBoxPosition = () => {
  const minRow = randomInRange(1, 10)
  const maxRow = randomInRange(minRow, 11)
  const minCol = randomInRange(1, 10)
  const maxCol = randomInRange(minCol, 11)
  BOX.style.setProperty('--row', `${minRow}/${maxRow}`)  
  BOX.style.setProperty('--col', `${minCol}/${maxCol}`)  
}

document.body.addEventListener('click', async () => {
  const transition = document.createDocumentTransition()
  await transition.start(() => {
    setBoxPosition()
  })
})

setBoxPosition()