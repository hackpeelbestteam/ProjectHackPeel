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
    url: "",
  };

  socket.on("login", ({ name, room, url }) => {
    socket.join(room);
    let user = { name: name, url: url };

    if (val.users.find((e) => e.name != name)) {
      val.users.push(user);
    }
    if (state.get(room)) {
      val = state.get(room);
    } else {
      val.host = name;
      state.set(room, val);
    }
    console.log(name, "joined", room);
    console.log(val.page, "sent");
    // send current pagenum
    socket.emit("join", val.page);
    socket.emit("seturl", val.url);
    socket.emit("sethost", val.host);
    socket.emit("setpresenter", val.presenter);
  });

  socket.on("go", ({ n, room }) => {
    val.page = n;
    state.set(room, val);
    io.to(room).emit("goto", val.page);
    console.log(val);
  });

  socket.on("seturl", ({ url, room }) => {
    val.url = url;
    state.set(room, val);
    io.to(room).emit("seturl", val.url);
    console.log("seturl", url, val);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
