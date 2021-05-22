const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

//getUsername and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();
//Join chatroom

socket.emit("joinRoom", { username, room });
socket.on("message", (message) => {
  outputMessage(message);

  //scroll down
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Emit message to server
  const msg = e.target.elements.msg.value;
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = "";
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;

  document.querySelector(".chat-messages").appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
