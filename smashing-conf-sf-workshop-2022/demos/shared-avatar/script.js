const HEAD = document.querySelector('head')

const ADD_PAGE_TRANSITION_SPEED = (id, speed) => {
  const PAGE_TRANSITION_STUFF = document.createElement('style')
  PAGE_TRANSITION_STUFF.setAttribute('type', 'text/css')
  PAGE_TRANSITION_STUFF.innerText = `::page-transition-container(${id}),::page-transition-outgoing-image(${id}),::page-transition-incoming-image(${id}) {animation-duration: ${speed};}`
  PAGE_TRANSITION_STUFF.innerText += `::page-transition-image-wrapper(${id}) {mix-blend-mode: normal;}`
  PAGE_TRANSITION_STUFF.innerText += `::page-transition-incoming-image(${id}),:page-transition-outgoing-image(${id}) {height: 100%;}`
  HEAD.appendChild(PAGE_TRANSITION_STUFF)
}

ADD_PAGE_TRANSITION_SPEED('box', '0.25s')

let inYourHead = false
let box = document.querySelector('.box')
const NAV = document.querySelector('nav')
const MAIN = document.querySelector('main')

document.body.addEventListener('click', () => {
  // Toggle in your head.
  inYourHead = !inYourHead
  // Transition it.
  const transition = document.createDocumentTransition()
  transition.start(() => {
    if (inYourHead) {
      NAV.appendChild(box)
    } else {
      MAIN.appendChild(box)
    }
  })
})