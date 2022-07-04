const HEAD = document.querySelector('head')

const ADD_PAGE_TRANSITION_SPEED = (id, speed, delay = '0s') => {
  const PAGE_TRANSITION_STUFF = document.createElement('style')
  PAGE_TRANSITION_STUFF.setAttribute('type', 'text/css')
  PAGE_TRANSITION_STUFF.innerText = `::page-transition-container(${id}),::page-transition-outgoing-image(${id}),::page-transition-incoming-image(${id}) {animation-duration: ${speed}; animation-delay: ${delay};}`
  PAGE_TRANSITION_STUFF.innerText += `::page-transition-image-wrapper(${id}) {mix-blend-mode: normal;}`
  PAGE_TRANSITION_STUFF.innerText += `::page-transition-incoming-image(${id}),:page-transition-outgoing-image(${id}) {height: 100%;}`
  HEAD.appendChild(PAGE_TRANSITION_STUFF)
}

ADD_PAGE_TRANSITION_SPEED('card-one', '0.1s', '0s')
ADD_PAGE_TRANSITION_SPEED('card-two', '0.1s', '0.1s')
ADD_PAGE_TRANSITION_SPEED('card-three', '0.1s', '0.2s')
ADD_PAGE_TRANSITION_SPEED('card-four', '0.1s', '0.3s')

const CARDS = document.querySelectorAll('.card')
const shuffle = () => {
  const POSITIONS = [0, 1, 2, 3].sort(() => Math.random() - 0.5)
  CARDS.forEach((card, index) => {
    card.style.setProperty('--order', POSITIONS[index])
  })
}


document.body.addEventListener('click', async () => {
  const transition = document.createDocumentTransition()
  await transition.start(() => {
    shuffle()
  })
})

shuffle()