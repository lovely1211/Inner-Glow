import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../axiosInstance';
import socket from "../../../commonComp/socket";

const TypingAnimation = () => (
  <div className="text-center text-gray-500">
    <span>Typing</span>
    <span className="animate-pulse">...</span>
  </div>
);

const Consult = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [chatHistory, setChatHistory] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axiosInstance.get('/doctor');
        setUsers(response.data);
      } catch (err) {
        console.log('Error fetching users:', err);
      }
    };
    fetchAllUsers();
  }, []);

  useEffect(() => {
    const handleMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };
  
    socket.on("message", handleMessage);
  
    return () => {
      socket.off("message", handleMessage);
    };
  }, [selectedDoctor]);  
  
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userInfo ? userInfo.id : null;

  useEffect(() => {
    const fetchMessages = async () => {

      if (!selectedDoctor || !userId) return;
  
      try {
        const response = await axiosInstance.get(`/getMessages/${userId}/${selectedDoctor._id}`);
        setMessages(response.data.messages || []);
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    };
  
    fetchMessages();
  }, [selectedDoctor, userId]);

  useEffect(() => {
    if (selectedDoctor?._id) {
      setMessages(chatHistory[selectedDoctor._id] || []);
    }
  }, [selectedDoctor, chatHistory]);

  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleSend = async () => {
    if (!userInput || loading) return;
  
    const newMessage = {
      sender: "user",
      text: userInput,
      timestamp: new Date(),
    };
  
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo ? userInfo.id : null;
  
    if (!userId || !selectedDoctor?._id) {
      console.error("User ID or Doctor ID missing");
      return;
    }
  
    try {
      const response = await axiosInstance.post("/sendMessage", {
        userId: userId,
        doctorId: selectedDoctor._id,
        sender: "user",
        text: userInput,
      });
  
      console.log("Response from server:", response.data); // Yeh console zaroor check karna
  
      socket.emit("message", {
        userId,
        doctorId: selectedDoctor._id,
        sender: "user",
        text: userInput,
      });
  
      setUserInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };  
  
  // Listen for typing event
  useEffect(() => {
    let typingTimeout;
  
    socket.on("typing", (data) => {
      if (data.doctorId === selectedDoctor?._id) {
        setLoading(true);
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => setLoading(false), 2000);
      }
    });
  
    return () => {
      socket.off("typing");
      clearTimeout(typingTimeout);
    };
  }, [selectedDoctor]);  

  return (
    <div className='flex'>
      <div className="w-1/3 p-4 border-r border-gray-300 h-screen overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Choose a Doctor</h2>
        <ul>
          {users.length > 0 ? (
            users.map((user) => (
              <li
                key={user._id}
                className={`p-2 flex justify-between cursor-pointer shadow-white border-b ${selectedDoctor?._id === user._id ? 'bg-gray-200' : ''}`}
                onClick={() => handleDoctorClick(user)}
              >
                <span className="font-bold">{user.name}</span>
                <span className="block text-sm text-gray-500">{user.specialization}</span>
                <span className="block text-sm text-gray-500">{user.experience} yr</span>
                <span className="text-green-600 font-medium">{user.fees}/-</span>
              </li>
            ))
          ) : (
            <div className="text-gray-500">No doctors available</div>
          )}
        </ul>
      </div>

      <div className="w-2/3 p-4 h-screen flex flex-col">
        <h2 className="text-center font-bold text-xl my-4">Consult to a Doctor for your problems</h2>
        <h2>Chat with {selectedDoctor?.name || "..."}</h2>

        <div className="flex-1 mt-6 overflow-y-auto">
          {selectedDoctor ? (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`p-2 text-white rounded-lg inline-block max-w-2/3 ${message.sender === 'user' ? 'bg-blue-500' : 'bg-gray-600'}`}>
                    {message.text}
                  </div>
                </div>
              ))}
              {loading && <TypingAnimation />}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-10 text-lg">Select a mentor and start chatting...</div>
          )}
        </div>

        {selectedDoctor && (
          <div className="flex my-4 space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              className="p-3 rounded-lg w-full text-gray-800 border border-gray-300 focus:border-gray-800"
            />
            <button
              className="text-white font-medium px-4 py-2 rounded-lg shadow-md text-xl bg-blue-500 hover:bg-blue-700"
              onClick={handleSend}
              disabled={loading}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Consult;
