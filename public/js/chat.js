const socket = io()

socket.on('message', (message) => {
  console.log(message)
})

document.querySelector('#message-form').addEventListener('submit', (event) => {
  event.preventDefault()
  const message = event.target.elements.message.value
  socket.emit('sendMessage', message)
})

document.querySelector('#send-location').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('location unavailable')
  }
  navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
    socket.emit('sendLocation', {
      latitude,
      longitude
    })
  })
})