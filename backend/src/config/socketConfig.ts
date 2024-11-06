import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { chatService } from "../services/chatServices";

import { chatRepository } from "../repositories/chatRepository";

const chatRepositoryInstance = new chatRepository();
const chatServices = new chatService(chatRepositoryInstance);

let io: SocketServer;
const onlineUser: { [key: string]: string } = {};

const userSocketMap: {
  [key: string]: string;
} = {};

export const getReceiverSocketId = (userId: string) => {
  console.log("reciever and his socket id are ", userId, userSocketMap[userId]);
  return userSocketMap[userId];
};

const configSocketIO = (server: HttpServer) => {
  try {
    console.log("socket");

    io = new SocketServer(server, {
      cors: {
        origin: ["http://localhost:5173"],
      },
    });

    io.on("connection", (socket) => {
      console.log("User connected,", socket.id);
      const userId = socket.handshake.query.userId;
      console.log("userid", userId);

      if (userId != undefined) {
        userSocketMap[userId as string] = socket.id;
        onlineUser[userId as string] = socket.id;
      }
      console.log("socketMap", userSocketMap);

      socket.on("joinChatRoom", ({ doctorID, userID, online }) => {
        const roomName = [doctorID, userID].sort().join("-");
        if (online === "USER") {
          socket.join(roomName);
          if (onlineUser[doctorID]) {
            io.emit("receiverIsOnline", { user_id: doctorID });
          } else {
            io.emit("receiverIsOffline", { user_id: doctorID });
          }
          console.log(`User ${userID} joined room: ${roomName}`);
        }
        if (online === "DOCTOR") {
          socket.join(roomName);
          if (onlineUser[userID]) {
            io.emit("receiverIsOnline", { user_id: userID });
          } else {
            io.emit("receiverIsOffline", { user_id: userID });
          }
          console.log(`Doctor ${doctorID} joined room: ${roomName}`);
        }
      });

      socket.on("sendMessage", async ({ messageDetails }) => {
        try {
          console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");

          let savedMessage: null | any = null;

          const connectionDetails: any = await chatServices.createChat(
            messageDetails
          );
          savedMessage = connectionDetails;

          const chatRoom = [messageDetails.senderID, messageDetails.receiverID]
            .sort()
            .join("-");
          console.log("sss", savedMessage);

          io.to(chatRoom).emit("receiveMessage", savedMessage);
          //  io.to(`chatNotificationRoom${savedMessage?.receiverID}`).emit("newChatNotification", savedMessage?.message);
        } catch (error) {
          console.log(error);
        }
      });

      socket.on("outgoing-video-call", (data) => {
        const userSocketId = getReceiverSocketId(data.to);
        console.log(userSocketId, "OUT");
        if (userSocketId) {
          console.log("dddddddddd", userSocketMap);
          console.log("cccccccc", data);

          socket.to(userSocketId).emit("incoming-video-call", {
            from: data.from,
            roomId: data.roomId,
            callType: data.callType,
          });
        }
      });

      socket.on("accept-incoming-call", (data) => {
        const friendSocketId = getReceiverSocketId(data.to);
        if (friendSocketId) {
          socket.to(friendSocketId).emit("accept-call", data);
        }
      });

      socket.on("leave-room", (data) => {
        // console.log('coming here')
        const friendSocketId = getReceiverSocketId(data.to);
        if (friendSocketId) {
          // console.log('coming here')
          socket.to(friendSocketId).emit("user-left");
        }
      });

      socket.on("reject-call", (data) => {
        // console.log('data coming through reject call is ',data)
        const friendSocketId = getReceiverSocketId(data.to);
        if (friendSocketId) {
          socket.to(friendSocketId).emit("call-rejected");
        }
      });

      socket.on("disconnect", () => {
        const disconnectUser = Object.keys(onlineUser).find(
          (userId) => onlineUser[userId] === socket.id
        );
        if (disconnectUser) {
          delete onlineUser[disconnectUser];
          io.emit("receiverIsOffline", { user_id: disconnectUser });
        }
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  } catch (error: any) {
    console.log("error", error);
  }
};

export { configSocketIO, io };
