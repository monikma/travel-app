import { performAction } from './js/app.js'
import './styles/main.scss'
import './js/app.js'

console.log("Built with Webpack");

// exports for 'Client' library:
export {
    performAction
}

/* Function called by event listener */
document.getElementById('generate').addEventListener('click', performAction);