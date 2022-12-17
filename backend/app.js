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
    page: 1,
    presenter: "name",
    host: "",
    url: "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf",
  };

  socket.on("login", ({ name, room }) => {
    socket.join(room);
    if (state.get(room)) {
      val = state.get(room);
    } else {
      val.host = name;
      state.set(room, val);
    }
    if (!val.users.includes(name)) {
      val.users.push(name);
    }
    console.log(name, "joined", room);
    console.log(val.page, "sent");
    // send current pagenum
    socket.emit("join", val.page);
    socket.emit("setdoc", val.url);
    socket.emit("sethost", val.host);
  });

  socket.on("go", ({ n, room }) => {
    val.page = n;
    state.set(room, val);
    io.to(room).emit("goto", val.page);
    console.log(val);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
