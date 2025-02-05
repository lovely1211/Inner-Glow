import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axiosInstance'; 
import socket from "../../commonComp/socket"; 

const Consult = () => {
  const [users, setUsers] = useState([]); // List of doctors
  const [messages, setMessages] = useState([]); // All messages
  const [userInput, setUserInput] = useState(''); // User input message
  const [selectedPatient, setSelectedPatient] = useState(null); // Selected doctor
  const [loading, setLoading] = useState(false); // Typing indicator
  const userInfo = JSON.parse(localStorage.getItem('userInfo')); 
  const doctorId = userInfo ? userInfo.id : null;

  // Fetch all messages when the component mounts
  useEffect(() => {
    if (selectedPatient) {
      axiosInstance.get(`/messages/${selectedPatient.patientId}/${doctorId}`)
        .then((res) => {
          setMessages(res.data);
        })
        .catch((err) => console.log('Error fetching messages:', err));
    }

    const handleMessage = (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    };
  
    socket.on("receiveMessage", handleMessage);
  
    return () => {
      socket.off("receiveMessage", handleMessage);
    };

  }, [selectedPatient, doctorId]);

  // Fetch patients
  useEffect(() => {
    const fetchAllUsers = async () => {
      
    const userInfo = JSON.parse(localStorage.getItem('userInfo')); 
    const doctorId = userInfo ? userInfo.id : null;

      try {
        const response = await axiosInstance.get(`/doctor/${doctorId}/patients`);
        setUsers(response.data);
      } catch (err) {
        console.log('Error fetching doctors:', err);
      }
    };
    fetchAllUsers();
  }, []);

  // Handle patient selection
  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
  };

  // Handle sending message
  const handleSend = (e) => {
    if (!userInput || loading || !selectedPatient) return;
  
    e.preventDefault();
  
    const messageData = {
      senderId: doctorId, 
      receiverId: selectedPatient.patientId, 
      text: userInput,
      sender: 'doctor', 
      receiver: 'patient', 
    };
  
    // Send the message via socket
    socket.emit("sendMessage", messageData);
  
    // Update UI immediately
    setMessages((prevMessages) => [...prevMessages, messageData]);
  
    // Reset input after sending the message
    setUserInput("");
  };  

  // Handle typing event
  useEffect(() => {
    let typingTimeout;

    socket.on("typing", (data) => {
      if (data.receiverId === selectedPatient?._id) {
        setLoading(true);
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => setLoading(false), 2000);
      }
    });

    return () => {
      socket.off("typing");
      clearTimeout(typingTimeout);
    };
  }, [selectedPatient]);

  return (
    <div className='flex'>
      {/* Patient List */}
      <div className="w-1/3 p-4 border-r border-gray-300 h-screen overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Choose a Patient</h2>
        <ul>
          {users.length > 0 ? (
            users.map((user) => (
              <li
                key={user._id}
                className={`p-2 flex justify-between cursor-pointer shadow-white border-b ${
                  selectedPatient?._id === user._id ? 'bg-gray-200' : ''
                }`}
                onClick={() => handlePatientClick(user)}
              >
                <span className="font-bold">{user.name}</span>
              </li>
            ))
          ) : (
            <div className="text-gray-500">No patient available</div>
          )}
        </ul>
      </div>

      {/* Chat Box */}
      <div className="w-2/3 p-4 h-screen flex flex-col">
        <h2 className="text-center font-bold text-xl my-4">
          Consultation Time...
        </h2>
        <h2>Chat with {selectedPatient?.name || "..."}</h2>

        {/* Messages */}
        <div className="flex-1 mt-6 overflow-y-auto">
          {selectedPatient ? (
            <div className="space-y-4">
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <div key={index} className={`flex ${message.senderId === doctorId ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-1 text-white rounded-lg inline-block max-w-2/3 ${message.senderId === doctorId ? 'bg-blue-500' : 'bg-gray-600'}`}>
                      {message.text}
                    </div>
                  </div>
                ))                
              ) : (
                <div>No messages yet...</div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-10 text-lg">
              Select a patient and start chatting...
            </div>
          )}
        </div>

        {/* Input Field */}
        {selectedPatient && (
          <div className="flex my-2 space-x-2">
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
