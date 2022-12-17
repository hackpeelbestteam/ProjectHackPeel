const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app, {
  cors: {
    origin: "*",
  },
});
const { Server } = require("socket.io");
const { addUser, getUser, deleteUser, getUsers } = require("./users");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

var cn = 1;
var url =
  "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf";

io.on("connection", async (socket) => {
  socket.on("login", ({ name, room }) => {
    const { user } = addUser(socket.id, name, room);
    socket.join(user.room);
    console.log("joined", user.name, user.room);
    io.in(room).emit("users", getUsers(room));
  });

  // send current pagenum
  socket.emit("join", cn);
  socket.emit("setdoc", url);

  socket.on("disconnect", () => {
    console.log("User disconnected");
    const user = deleteUser(socket.id);
    if (user) {
      io.in(user.room).emit("notification", {
        title: "Someone just left",
        description: `${user.name} just left the room`,
      });
      io.in(user.room).emit("users", getUsers(user.room));
    }
  });
  socket.on("to", (num) => {
    cn = num;
    io.emit("to", num);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
