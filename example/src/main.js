import './style.css'
import { setupCamera } from '@pimred/camera-poster'

setupCamera(document.querySelector('#camera'), 'http://localhost:8080/ocr', (data) => { console.log(data) })
