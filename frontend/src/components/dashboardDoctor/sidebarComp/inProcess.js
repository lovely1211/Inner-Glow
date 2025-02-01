import React, { useState, useEffect } from "react";

const InProcess = () => {
  const [inProcessChats, setInProcessChats] = useState([]);
  
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const doctorId = userInfo?.id;

  useEffect(() => {
    if (doctorId) {
      fetch(`http://localhost:7000/api/doctors/${doctorId}/inProcessChats`)
        .then((res) => res.json())
        .then((data) => setInProcessChats(data))
        .catch((err) => console.error("Error fetching in-process chats:", err));
    }
  }, [doctorId]);

  const openChat = (userId) => {
    console.log(`Opening chat with userId: ${userId}`);
    // Implement navigation or chat opening logic here
  };

  return (
    <div>
      <h3>Active Chats</h3>
      {inProcessChats.length > 0 ? (
        inProcessChats.map((chat) => (
          <div key={chat.userId} onClick={() => openChat(chat.userId)}>
            <p>{chat.userName}</p>
            <p>New Message: {chat.lastMessage}</p>
          </div>
        ))
      ) : (
        <p>No active chats.</p>
      )}
    </div>
  );
};

export default InProcess;
