import React, { useState, useEffect } from "react";

const NewChat = () => {
  const [newChats, setNewChats] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const doctorId = userInfo?.id;

  useEffect(() => {
    if (doctorId) {
      fetch(`http://localhost:7000/api/doctors/${doctorId}/newChats`)
        .then((res) => res.json())
        .then((data) => setNewChats(data))
        .catch((err) => console.error("Error fetching new chats:", err));
    }
  }, [doctorId]);

  const openPopup = (userId) => setSelectedUserId(userId);
  const closePopup = () => setSelectedUserId(null);

  const acceptChat = (userId) => {
    fetch(`http://localhost:7000/api/doctors/${doctorId}/acceptChat/${userId}`, { method: "POST" })
      .then(() => {
        closePopup();
        // moveToInProcess(userId);
      })
      .catch((err) => console.error("Error accepting chat:", err));
  };

  const declineChat = (userId) => {
    fetch(`http://localhost:7000/api/doctors/${doctorId}/declineChat/${userId}`, { method: "POST" })
      .then(() => closePopup())
      .catch((err) => console.error("Error declining chat:", err));
  };

  return (
    <div>
      <h3>New Chat Requests</h3>
      {newChats.map((chat) => (
        <div key={chat.userId} onClick={() => openPopup(chat.userId)}>
          <p>{chat.userName}</p>
          <p>{chat.lastMessage}</p>
          <p>{chat.timestamp} time ago</p>
        </div>
      ))}

      {selectedUserId && (
        <div className="popup">
          <h4>Accept chat request?</h4>
          <button onClick={() => acceptChat(selectedUserId)}>Accept</button>
          <button onClick={() => declineChat(selectedUserId)}>Decline</button>
        </div>
      )}
    </div>
  );
};

export default NewChat;
