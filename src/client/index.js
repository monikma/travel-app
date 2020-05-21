import { addTrip } from './js/app.js'
import { initUi } from './js/app.js'
import './styles/main.scss'
import './js/app.js'

console.log("Built with Webpack");

// exports for 'Client' library:
export {
    addTrip, initUi
}

/* Function called by event listener */
document.getElementById('generate').addEventListener('click', addTrip);
document.addEventListener('DOMContentLoaded', initUi)