import styles from './styles.module.css'

/**
 * Sets up a camera preview and allows the user to take a photo to be uploaded to a specified URL.
 *
 * @param {HTMLElement} spawnerButton - The HTML element that will spawn the camera module when clicked.
 * @param {string} postUrl - The URL to which the photo will be uploaded.
 * @param {function} callbackFunction - The function to be called after the photo is uploaded. Takes a single parameter, which is the data returned from the server.
 * @returns {void}
 */
export function setupCamera (spawnerButton, postUrl, callbackFunction) {
  const width = 1280 // We will scale the photo width to this
  let height = 0 // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  let streaming = false

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  let video = null
  let canvas = null
  let photo = null
  let shutterButton = null
  let submitButton = null
  let closeButton = null
  let camera = null

  let previewActive = false

  /**
   * Creates and returns a DOM element that contains a camera interface with video, canvas, and photo display elements,
   * as well as buttons for taking and submitting photos and closing the interface.
   * @param {HTMLElement} element - The DOM element (shutter button) after which to insert the camera interface element.
   * @returns {HTMLElement} - The created camera interface element.
   */
  function buildHTML (element) {
    const htmlString = `
        <video class="video">Video stream steht nicht zur Verfügung.</video>
        <canvas class="canvas"> </canvas>
        <div class="output">
          <img class="photo" alt="The screen capture will appear in this box." />
        </div>
        <button class="shutterButton">Foto aufnehmen</button>
        <button class="submitButton">Senden</button>
        <button class="closeButton">Schließen</button>
    `
    const div = document.createElement('div')
    div.classList.add(styles.cameraWrapper)
    div.innerHTML = htmlString.trim()

    element.parentNode.insertBefore(div, element.nextSibling)
    return div
  }

  /**
   * Converts a data URI string to a Blob object.
   *
   * @param {string} dataURI - The data URI string to convert.
   * @returns {Blob} The resulting Blob object.
   */
  function dataURItoBlob (dataURI) {
    const byteString = atob(dataURI.split(',')[1])
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], { type: mimeString })
  }

  /**
   * Starts the video stream from the camera.
   * @returns {void}
   */
  function handleRequest () {
    const imageDataUrl = canvas.toDataURL('image/jpeg', 1.0)
    const blob = dataURItoBlob(imageDataUrl)

    const formData = new FormData()
    formData.append('document', blob, 'image.jpg')

    fetch(postUrl, {
      method: 'POST',
      cache: 'no-cache',
      cors: 'no-cors',
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        closeCamera()
        callbackFunction(data)
      })
      .catch(error => console.error(error))
  }

  /**
   * Check if the current page is being viewed within an iframe and, if so, replace the iframe's content with a button,
   * that allows the user to open the current page in a new window.
   *
   * @returns {boolean} `true` if the button was successfully shown, `false` otherwise.
   */
  function showViewLiveResultButton () {
    if (window.self !== window.top) {
      document.querySelector('.contentarea').remove()
      const button = document.createElement('button')
      button.textContent = 'View live result of the example code above'
      document.body.append(button)
      button.addEventListener('click', () => window.open(location.href))
      return true
    }
    return false
  }

  /**
   * Initializes the camera module by building the HTML, getting the media stream,
   * and setting up event listeners for buttons and video elements.
   *
   * @returns {void}
   */
  function startup () {
    if (showViewLiveResultButton()) {
      return
    }
    camera = buildHTML(spawnerButton)
    video = document.querySelector('.video')
    video.classList.add(styles.video)

    canvas = document.querySelector('.canvas')
    canvas.classList.add(styles.canvas)

    photo = document.querySelector('.photo')
    photo.classList.add(styles.photo)

    shutterButton = document.querySelector('.shutterButton')
    shutterButton.classList.add(styles.cameraModuleButton, styles.shutterButton)

    submitButton = document.querySelector('.submitButton')
    submitButton.classList.add(styles.cameraModuleButton, styles.submitButton)
    submitButton.addEventListener('click', handleRequest, false)

    closeButton = document.querySelector('.closeButton')
    closeButton.classList.add(styles.cameraModuleButton, styles.closeButton)
    closeButton.addEventListener('click', closeCamera, false)

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('getUserMedia is not supported on this browser or connection type. Please use an HTTPS connection.')
    } else {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            width: { min: 1024, ideal: 1280, max: 1920 },
            height: { min: 576, ideal: 720, max: 1080 },
            facingMode: 'environment'
          }
        })
        .then((stream) => {
          video.srcObject = stream
          video.play()
        })
        .catch((err) => {
          console.error(`An error occurred: ${err}`)
        })
    }

    video.addEventListener(
      'canplay',
      (ev) => {
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth / width)

          // Firefox currently has a bug where the height can't be read from
          // the video, so we will make assumptions if this happens.

          if (isNaN(height)) {
            height = width / (4 / 3)
          }

          video.setAttribute('width', width)
          video.setAttribute('height', height)
          canvas.setAttribute('width', width)
          canvas.setAttribute('height', height)
          streaming = true
        }
      },
      false
    )

    shutterButton.addEventListener('click',
      (ev) => {
        takepicture()
        ev.preventDefault()
      },
      false
    )

    clearphoto()
  }

  /**
   * Fill the photo with an indication that none has been captured.
   */
  function clearphoto () {
    const context = canvas.getContext('2d')
    context.fillStyle = '#AAA'
    context.fillRect(0, 0, canvas.width, canvas.height)

    const data = canvas.toDataURL('image/jpg')
    photo.setAttribute('src', data)
  }

  /**
   * Toggles the preview mode of the camera interface.
   *
   * @returns {boolean} `true` if the preview mode was deactivated, `false` if it was activated.
   */
  function togglePreview () {
    if (previewActive) {
      previewActive = false
      shutterButton.innerHTML = 'Take photo'
      // hide photo
      photo.style.display = 'none'
      return true
    }
    previewActive = true
    shutterButton.innerHTML = 'Verwerfen'
    photo.style.display = 'block'
    return false
  }

  /**
   * Closes the camera interface by stopping the video stream and removing the camera wrapper element from the DOM.
   */
  function closeCamera () {
    previewActive = false
    const stream = video.srcObject
    const tracks = stream?.getTracks()

    tracks?.forEach(function (track) {
      track.stop()
    })

    video.srcObject = null
    // const camera = document.querySelector('.cameraWrapper')
    camera.parentNode.removeChild(camera)
  }

  /**
   * Takes a picture using the camera video stream and renders it onto the canvas and photo elements.
   * If the preview mode is active, it toggles back to the camera mode.
   */
  function takepicture () {
    if (togglePreview()) return // close preview and go back to camera
    const context = canvas.getContext('2d')
    if (width && height) {
      canvas.width = width
      canvas.height = height
      context.drawImage(video, 0, 0, width, height)

      const data = canvas.toDataURL('image/png')
      photo.setAttribute('src', data)
    } else {
      clearphoto()
    }
  }

  spawnerButton.addEventListener('click', startup, false)
}
