const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("static"));

var cn = 1;

io.on("connection", async (socket) => {
  // send current pagenum
  socket.emit("join", cn);

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
