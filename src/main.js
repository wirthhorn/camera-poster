import { setupCamera } from '@/camera.js'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Press the button!</h1>
    <button id="cameraButton" type="button">Click me!</button>
    <p class="read-the-docs">
      Click on the button to open the camera and take a picture.
    </p>
  </div>
`

setupCamera(document.querySelector('#cameraButton'), 'http://localhost:8080/ocr', (isbns) => { console.log(isbns.isbnList) })
