import { Server } from "socket.io";

let port = process.env.PORT || 3000;

const io = new Server(port);

io.on("connection", (socket) => {
  let users = {}
  if (socket.request.headers.username == undefined){
    return socket.leave(socket.id);
  }
  users[socket.id] = socket.request.headers.username;
  socket.emit("online_users_count", socket.rooms.size.toString());

  socket.on("message", (data) => {
    socket.broadcast.emit("incoming", data)
  })

  socket.on("disconnect", async () => {
    delete users[socket.id];
    socket.emit("online_users_count", socket.rooms.size.toString());
  })
});

console.log(`Server is running on port ${port}...`);

// httpServer.listen(3000, () => {console.log("Server is running...")});