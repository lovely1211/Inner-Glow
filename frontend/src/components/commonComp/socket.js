import { io } from "socket.io-client";

const socket = io("http://localhost:7000", {
    withCredentials: true,
    transports: ["websocket", "polling"], 
  });
  
  socket.on("connect", () => {
    console.log("Connected to server");
  });
  
  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

export default socket;
