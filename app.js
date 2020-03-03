const express = require("express");
const socketio = require("socket.io");
const peer = require("simple-peer");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const path = require("path");
const io = socketio(server);

app.use(cors());
app.use(express.static(path.join(__dirname, "/public")));

const port = process.env.PORT || 3000;

let clients = 0;
io.on("connection", socket => {
  socket.on("permission_success", () => {
    if (clients < 2) {
      if (clients == 1) {
        console.log(clients);
        socket.emit("makePeer");
      }
    } else {
      socket.emit("sessionActive");
      console.log("err");
    }
    clients++;
  });
  socket.on("offer", offer => {
    socket.broadcast.emit("backReply", offer);
  });
  socket.on("Answer", data => {
    socket.broadcast.emit("backanswer", data);
  });
  socket.on("disconnect", () => {
    if (clients > 0) {
      clients -= 1;
    }
  });
});

server.listen(port);
