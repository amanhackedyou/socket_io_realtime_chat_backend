import { Server, Socket } from "socket.io";

let port = process.env.PORT || 3000;

const io = new Server(port);

io.on("connection", (socket) => {
  let users = {}
  if (socket.request.headers.username == undefined){
    return socket.leave(socket.id);
  }
  users[socket.id] = socket.request.headers.username;
  io.emit("online_users_count", io.engine.clientsCount.toString());

  socket.on("message", (data) => {
    socket.broadcast.emit("incoming", data);
  })

  socket.on("disconnect", async () => {
    delete users[socket.id];
    io.emit("online_users_count", io.engine.clientsCount.toString());
  })
});

console.log(`Server is running on port ${port}...`);

// httpServer.listen(3000, () => {console.log("Server is running...")});