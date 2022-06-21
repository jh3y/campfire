const HEAD = document.querySelector('head')

const ADD_PAGE_TRANSITION_SPEED = (id, speed) => {
  const PAGE_TRANSITION_STUFF = document.createElement('style')
  PAGE_TRANSITION_STUFF.setAttribute('type', 'text/css')
  PAGE_TRANSITION_STUFF.innerText = `::page-transition-container(${id}),::page-transition-outgoing-image(${id}),::page-transition-incoming-image(${id}) {animation-duration: ${speed};}`
  PAGE_TRANSITION_STUFF.innerText += `::page-transition-image-wrapper(${id}) {mix-blend-mode: normal;}`
  HEAD.appendChild(PAGE_TRANSITION_STUFF)
}

ADD_PAGE_TRANSITION_SPEED('avatar', '0.5s')

const CONTROLS = document.querySelector('.nav-controls')
const FORM_REVEALER = document.querySelector('[togglepopup=signin]')
const SIGN_FORM = document.querySelector('#signin')
const SIGN_AVATAR = document.querySelector('.sign-form__avatar')
const SIGN_IN_BUTTON = document.querySelector('.sign-form__button--sign-in')
const SIGN_OUT_BUTTON = document.querySelector('.sign-form__button--sign-out')

SIGN_IN_BUTTON.addEventListener('click', async () => {
  const transition = document.createDocumentTransition()
  await transition.start(() => {
    FORM_REVEALER.setAttribute('title', 'sign out')
    SIGN_FORM.hidePopup()
    CONTROLS.insertBefore(SIGN_AVATAR, FORM_REVEALER)
    SIGN_FORM.classList.add('sign-form--logout')
  })
})

SIGN_OUT_BUTTON.addEventListener('click', () => {
  SIGN_FORM.insertBefore(SIGN_AVATAR, SIGN_IN_BUTTON)
  SIGN_FORM.hidePopup()
  FORM_REVEALER.setAttribute('title', 'sign in')
  SIGN_FORM.classList.remove('sign-form--logout')
})