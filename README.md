# Camera Poster

Camera Poster is a lightweight npm package that lets you easily add a camera viewport to your web application. With just a few lines of code, you can spawn a camera canvas in the browser and allow your users to snap a picture and send it via a post request to a specified endpoint. Optionally you can handle the response by specifying a callback function.

This library is intentionally build with vanilla JS in order to keep it lightweight, and simple in terms of dependencies.

## Installation
To install Camera Poster, simply run the following command:

```sh
npm install @pimred/camera-poster
```

## Usage
To use Camera Poster, you need to import it into your project and call the setup function with the appropriate parameters. Here's an example of how to do that:

```javascript
import { setupCamera } from '@pimred/camera-poster'
import '@pimred/camera-poster/style.css'

/**
 * Sets up a camera preview and allows the user to take a photo to be uploaded to a specified URL.
 *
 * @param {HTMLElement} spawnerButton - The HTML element that will spawn the camera module when clicked.
 * @param {string} postUrl - The URL to which the photo will be uploaded.
 * @param {function} callbackFunction - The function to be called after the photo is uploaded. Takes a single parameter, which is the data returned from the server.
 * @returns {void}
 */
setupCamera(document.querySelector('#button'), 'http://<where-to-send-image>/', (data) => { console.log(data) })

```

In this example, we call the setup function, and pass in three options:
- `spawnerButton`: an HTML element to which an event listener will be attached. Clicking on it will spawn the camera utility.
- `postUrl`: the URL where the captured image will be sent via a post request.
- `callbackFunction`: Optional, handles the response data of the endpoint at `postUrl`.

## API
Camera Poster provides the following methods:

### setupCamera()
Attaches an event listener to the specified HTML element, which will spawn the camera utility on click.

## Development

1. **Increment version** in package.json

2. Build the dist files
`npm run build`

3. Publish to npm
`npm publish --access public`

## License
Camera Poster is released under the MIT License. See LICENSE file for details.
