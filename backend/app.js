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
    presenter: "",
    host: "",
    url: "",
  };

  socket.on("login", ({ name, room, url }) => {
    socket.join(room);
    let user = { name: name, url: url };

    val.users.push(user);
    // if (val.users.find((e) => e.name != name)) {
    //   val.users.push(user);
    // }
    if (state.get(room)) {
      val = state.get(room);
    } else {
      val.host = name;
      state.set(room, val);
    }
    console.log(name, "joined", room);
    var users = val.users.map(function (x) {
      return x.name;
    });
    // send current pagenum
    socket.emit("join", val.page);
    socket.emit("seturl", val.url);
    socket.emit("sethost", val.host);
    socket.emit("setp", val.presenter);
    socket.emit("updateusers", users);
    io.to(room).emit("updateusers", users);
  });

  socket.on("go", ({ n, room }) => {
    val.page = n;
    state.set(room, val);
    io.to(room).emit("goto", val.page);
  });

  socket.on("seturl", ({ url, room }) => {
    val.url = url;
    state.set(room, val);
    io.to(room).emit("seturl", val.url);
    io.to(room).emit("goto", 1);
    console.log("seturl", url, val);
  });

  socket.on("setp", ({ user, room }) => {
    val.presenter = user;
    let url = "";
    if (user != "" && user != null) {
      url = val.users.find((x) => x.name === user).url;
    }
    io.to(room).emit("seturl", url);
    io.to(room).emit("setp", user);
    state.set(room, val);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
