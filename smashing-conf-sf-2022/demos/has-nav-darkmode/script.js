const THEME_TOGGLE = document.querySelector('.theme-toggle')
const NAV_CONTROL = document.querySelector('.nav-control')

const TOGGLE_THEME = () => THEME_TOGGLE.setAttribute('aria-pressed', THEME_TOGGLE.matches('[aria-pressed="false"]') ? true : false)

const CONTROL_NAV = () => NAV_CONTROL.setAttribute('aria-expanded', NAV_CONTROL.matches('[aria-expanded="false"]') ? true : false)

THEME_TOGGLE.addEventListener('click', TOGGLE_THEME)
NAV_CONTROL.addEventListener('click', CONTROL_NAV)