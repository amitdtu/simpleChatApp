let express = require("express");
let app = express();
let server = require("http").createServer(app);
let io = require("socket.io").listen(server);
let users = [];
let connections = [];

server.listen(process.env.PORT || 3000);
console.log("server is running...");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.sockets.on("connection", socket => {
  socket.on("new-user", name => {
    users[socket.id] = name;
    io.sockets.emit("user-connected", name);
  });
  connections.push(socket);
  console.log(`Connected: ${connections.length} sockets connected`);

  // Disconnected
  socket.on("disconnect", data => {
    connections.splice(connections.indexOf(socket), 1);
    console.log(`Disconnected: ${connections.length} sockets connected`);
    // socket.emit("user-disconnected", users[socket.id]);
  });

  // Send Message
  socket.on("send message", data => {
    // console.log(data);
    io.sockets.emit("new message", { msg: data, name: users[socket.id] });
  });
});
