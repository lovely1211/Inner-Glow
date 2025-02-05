// Frontend (React)
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const ChatApp = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/messages").then((res) => {
      setMessages(res.data);
    });

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (name && message) {
      socket.emit("sendMessage", { name, message });
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold">Chat App</h1>
      <input
        type="text"
        placeholder="Enter your name"
        className="border p-2 mt-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="mt-4 w-1/2 border p-4 h-64 overflow-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.name}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="mt-4 flex">
        <input
          type="text"
          placeholder="Type a message"
          className="border p-2 flex-grow"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 ml-2">Send</button>
      </form>
    </div>
  );
};

export default ChatApp;
