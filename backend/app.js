const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app, {
  cors: {
    origin: "*",
  },
});
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const state = new Map();

io.on("connection", async (socket) => {
  let val = {
    users: [],
    mn: 1,
    page: 1,
    presenter: "",
    host: "",
    url: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
  };
  socket.on("login", ({ name, room }) => {
    socket.join(room);
    if (state.get(room)) {
      val = state.get(room);
      val.users.push(name);
    } else {
      val.users.push(name);
      state.set(room, val);
    }
    console.log(name, "joined", room);
    console.log(val);
  });

  // send current pagenum
  socket.emit("join", val.page);
  socket.emit("setdoc", val.url);

  socket.on("go", ({ n, room }) => {
    val.page = n;
    state.set(room, val);
    io.to(room).emit("goto", n);
    console.log(val);
  });
  socket.on("mn", ({ n, room }) => {
    val.mn = n;
    console.log(n);
    state.set(room, val);
    io.to(room).emit("mn", n);
    console.log(val);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
