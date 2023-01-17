import { Server, Socket } from "socket.io";

let port = process.env.PORT || 3000;

const io = new Server(port);

io.on("connection", (socket) => {
  let users = {}
  if (socket.request.headers.username == undefined){
    return socket.leave(socket.id);
  }

  users[socket.id] = socket.request.headers.username;
  io.emit("online_user_count", io.engine.clientsCount.toString())
  socket.broadcast.emit("users_connection_status", {
    "count": io.engine.clientsCount.toString(),
    "username": users[socket.id],
    "type": "joined"
  });

  setTimeout(() => {
    io.to(socket.id).emit("incoming", {
      username: "Bot",
      msg: `Hello ${users[socket.id]}, Welcome to Realtime Chat Application by iMobCode!`
    });
  }, 1000);

  socket.on("message", (data) => {
    socket.broadcast.emit("incoming", data);
  })

  socket.on("disconnect", async () => {
    io.emit("users_connection_status", {
      "username": users[socket.id],
      "type": "left"
    });

    socket.broadcast.emit("online_user_count", io.engine.clientsCount.toString())

    delete users[socket.id];
  })
});

console.log(`Server is running on port ${port}...`);

// httpServer.listen(3000, () => {console.log("Server is running...")});