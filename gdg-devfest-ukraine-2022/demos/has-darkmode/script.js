const BUTTON = document.querySelector('button')

const TOGGLE_MODE = () => BUTTON.setAttribute('aria-pressed', BUTTON.matches('[aria-pressed="false"]') ? true : false)

BUTTON.addEventListener('click', TOGGLE_MODE)