const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/room1", (req, res) => {
  res.sendFile(__dirname + "/public/room1.html");
});

app.get("/room2", (req, res) => {
  res.sendFile(__dirname + "/public/room2.html");
});

app.get("/room3", (req, res) => {
  res.sendFile(__dirname + "/public/room3.html");
});

// techat namespace
const techat = io.of("/techat");

techat.on("connection", (socket) => {
  socket.on("join", (data) => {
    socket.join(data.room);
    techat.in(data.room).emit("message", `New user joined ${data.room} room!`);
  });

  socket.on("message", (data) => {
    console.log(`message: ${data.msg}`);
    techat.in(data.room).emit("message", data.msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    techat.emit("message", "user disconnected");
  });
});
