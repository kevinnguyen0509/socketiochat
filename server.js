const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const chatcordBotName = "Chat Cord Bot";
//set static folder
app.use(express.static(path.join(__dirname, "public")));

//run when a client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //To the person that joined/ connects
    socket
      .to(user.room)
      .emit("message", formatMessage(chatcordBotName, "Dude, Welcome!"));

    //Broadcast when a user connects but doesn't tell the person
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(chatcordBotName, `A Wild ${username} has appeared!`)
      );
  });

  //Listen for chatMessage variable
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg)); //sends to everyone
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(
          chatcordBotName,
          `The wild ${user.username} has fled the room!`
        )
      );
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`server running on ${port}`);
});
