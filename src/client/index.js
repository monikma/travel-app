import { addTripClicked } from './js/app.js'
import './styles/main.scss'
import './js/app.js'

console.log("Built with Webpack");

// exports for 'Client' library:
export {
    addTripClicked
}

/* Function called by event listener */
document.getElementById('generate').addEventListener('click', addTripClicked);