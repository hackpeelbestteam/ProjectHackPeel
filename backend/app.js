const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

var cn = 1;
var url =
  "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf";

io.on("connection", async (socket) => {
  // send current pagenum
  socket.emit("join", cn);
  socket.emit("setdoc", url);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("to", (num) => {
    cn = num;
    io.emit("to", num);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
