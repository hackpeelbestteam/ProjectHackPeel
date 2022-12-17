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
    socket.join(room);
    console.log("joined", name, room);
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
  socket.on("go", ({ n, room }) => {
    cn = n;
    console.log(room, cn);
    io.to(room).emit("goto", cn);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
