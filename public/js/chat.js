const socket = io()

// Set up element references
const messageForm = document.querySelector('#message-form')
const messageFormInput = messageForm.querySelector('input')
const messageFormButton = messageForm.querySelector('button')
const messages = document.querySelector('#messages')

// set up templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

function autoscroll() {
  //New message ekement
  const newMessage = messages.lastElementChild
  //Height of new message
  const newMessageStyles = getComputedStyle(newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin
  //Visible height
  const visibleHeight = messages.offsetHeight
  //Height of message container
  const containerHeight = messages.scrollHeight
  //How far have I scrolled?
  const scrollOffset = messages.scrollTop + visibleHeight

  if (containerHeight - newMessageHeight <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight
  }
}

socket.on('message', ({ username, text, createdAt }) => {
  const html = Mustache.render(messageTemplate, {
    username,
    text,
    createdAt: moment(createdAt).format('h:mm a')
  })
  messages.insertAdjacentHTML('beforeend', html)
  autoscroll()
})

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  })
  document.querySelector('#sidebar').innerHTML = html
})

messageForm.addEventListener('submit', (event) => {
  event.preventDefault()
  messageFormButton.setAttribute('disabled', 'disabled')

  const message = event.target.elements.message.value

  socket.emit('sendMessage', message, () => {
    messageFormButton.removeAttribute('disabled')
    messageFormInput.value = ''
    messageFormInput.focus()
  })
})

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error)
    location.href = '/'
  }
})