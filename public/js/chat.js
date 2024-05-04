const socket = io()

// Set up element references
const messageForm = document.querySelector('#message-form')
const messageFormInput = messageForm.querySelector('input')
const messageFormButton = messageForm.querySelector('button')
const locationButton = document.querySelector('#send-location')
const messages = document.querySelector('#messages')

// set up templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

socket.on('message', ({ text, createdAt }) => {
  console.log(text, createdAt)
  const html = Mustache.render(messageTemplate, {
    text,
    createdAt: moment(createdAt).format('h:mm a')
  })
  messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', ({ url, createdAt }) => {
  console.log(url, createdAt)
  const html = Mustache.render(locationTemplate, {
    location: url,
    createdAt: moment(createdAt).format('h:mm a')
  })
  messages.insertAdjacentHTML('beforeend', html)
})

messageForm.addEventListener('submit', (event) => {
  event.preventDefault()
  messageFormButton.setAttribute('disabled', 'disabled')

  const message = event.target.elements.message.value

  socket.emit('sendMessage', message, (words) => {
    messageFormButton.removeAttribute('disabled')
    messageFormInput.value = ''
    messageFormInput.focus()

    console.log('the message was delivered', words)
  })
})

locationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('location unavailable')
  }
  locationButton.setAttribute('disabled', 'disabled')
  navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
    socket.emit('sendLocation', {
      latitude,
      longitude
    }, () => {
      locationButton.removeAttribute('disabled')
    })
  })
})