const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const AuthRouter = require("./routes/auth");
const documentRoutes = require("./routes/document");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const User = require("./models/user");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://document-editor-qo3k.vercel.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST"],
  },
});
dotenv.config();

const port = process.env.PORT;

const connectedUsers = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join-document", async ({ documentId, userId }) => {
    socket.join(documentId);

    const user = await User.findById(userId).select("-password");
    if (!user) return;

    if (!connectedUsers[documentId]) {
      connectedUsers[documentId] = [];
    }

    if (
      !connectedUsers[documentId].some((u) => u.userId === user._id.toString())
    ) {
      connectedUsers[documentId].push({
        userId: user._id.toString(),
        name: user.username,
        email: user.email,
        socketId: socket.id,
      });
    }

    io.to(documentId).emit("user-joined", {
      userId,
      username: user.username,
      socketId: socket.id,
      connectedUsers: connectedUsers[documentId],
    });

    console.log(`User ${user.username} joined document: ${documentId}`);
  });

  socket.on("send-changes", ({ documentId, changes }) => {
    socket.to(documentId).emit("receive-changes", changes);
  });

  socket.on("disconnect", () => {
    for (const documentId in connectedUsers) {
      const disconnectedUser = connectedUsers[documentId].find(
        (user) => user.socketId === socket.id
      );

      connectedUsers[documentId] = connectedUsers[documentId].filter(
        (user) => user.socketId !== socket.id
      );

      io.to(documentId).emit("user-disconnect", {
        connectedUsers: connectedUsers[documentId],
        socketId: socket.id,
        name: disconnectedUser?.name || "Unknown",
      });
    }

    console.log(`User disconnected: ${socket.id}`);
  });
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: [
      "https://document-editor-qo3k.vercel.app",
      "http://localhost:3000",
    ],
  })
);

app.get("/", (req, res) => res.send("Hello World!"));
app.use("/auth", AuthRouter);
app.use("/doc", documentRoutes);

// app.listen(port, () => {
//   connectDB();
//   console.log(`Example app listening on port ${port}!`);
// });

server.listen(8000, () => {
  connectDB();
  console.log(`Server running on port ${port}!`);
});
