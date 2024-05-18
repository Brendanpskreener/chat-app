const url = 'wss://8h46yhxazc.execute-api.us-west-2.amazonaws.com/dev/'
const websocket = new WebSocket(url)

websocket.addEventListener("open", (event) => {
  const message = {
    action: "message",
    message: "Hello, Server"
  }
  websocket.send(JSON.stringify(message))
  console.log("socket opened", event)
})

websocket.addEventListener("message", ({ data }) => {
  console.log("message received", data)
})