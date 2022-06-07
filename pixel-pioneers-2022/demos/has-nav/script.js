const NAV_CONTROL = document.querySelector('.nav-control')

const CONTROL_NAV = () => NAV_CONTROL.setAttribute('aria-expanded', NAV_CONTROL.matches('[aria-expanded="false"]') ? true : false)

NAV_CONTROL.addEventListener('click', CONTROL_NAV)