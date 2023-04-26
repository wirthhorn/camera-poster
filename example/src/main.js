import { setupCamera } from '@pimred/camera-poster'
import '@pimred/camera-poster/style.css'

setupCamera(document.querySelector('#camera'), 'http://localhost:8080/ocr', (data) => { console.log(data) })
