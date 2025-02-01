import { io } from "socket.io-client";
const socket = io("http://localhost:7000"); 
export default socket;
