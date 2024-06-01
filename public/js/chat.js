const url = 'wss://8h46yhxazc.execute-api.us-west-2.amazonaws.com/dev/'
const websocket = new WebSocket(url)

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const autoscroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  // Visible height
  const visibleHeight = $messages.offsetHeight

  // Height of messages container
  const containerHeight = $messages.scrollHeight

  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight
  }
}

websocket.addEventListener("open", (event) => {
  const message = {
    action: "joinMessage",
  }
  websocket.send(JSON.stringify(message))
  console.log("socket opened", event)
})

websocket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data)
  console.log("message received:", message)
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', html)
  autoscroll()
})

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const text = e.target.elements.message.value
  const message = {
    action: "sendPublic",
    text
  }
  websocket.send(JSON.stringify(message))
  $messageFormInput.value = ''
  $messageFormInput.focus()

})