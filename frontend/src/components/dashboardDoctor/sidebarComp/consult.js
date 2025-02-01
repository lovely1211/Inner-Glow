import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axiosInstance';
import socket from '../../commonComp/socket';

const TypingAnimation = () => (
  <div className="text-center text-gray-500">
    <span>Typing</span>
    <span className="animate-pulse">...</span>
  </div>
);

const DoctorChat = () => {
  const [patients, setPatients] = useState([]);
  const [messages, setMessages] = useState([]);
  const [doctorInput, setDoctorInput] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [chatHistory, setChatHistory] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const doctorId = JSON.parse(localStorage.getItem("userInfo")).id;
        const response = await axiosInstance.get(`/patients/${doctorId}`);
        response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPatients(response.data);
        console.log(response.data)
      } catch (err) {
        console.log("Error fetching patients:", err);
      }
    };
    fetchPatients();
  }, []);  

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedPatient) {
        const doctorId = JSON.parse(localStorage.getItem("userInfo")).id;
        try {
          const response = await axiosInstance.get(`/getMessages/${selectedPatient._id}/${doctorId}`);
          setMessages(response.data.messages);
        } catch (error) {
          console.log("Error fetching messages:", error);
        }
      }
    };
  
    fetchMessages();
  }, [selectedPatient]);


  useEffect(() => {
    const handleMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [selectedPatient]);

  useEffect(() => {
    if (selectedPatient?._id) {
      setMessages(chatHistory[selectedPatient._id] || []);
    }
  }, [selectedPatient, chatHistory]);

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
  };

  const handleSend = () => {
    if (!doctorInput || loading) return;

    socket.emit("message", {
      type: "doctor",
      text: doctorInput,
      timestamp: new Date(),
      patientId: selectedPatient._id,
    });

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, { type: "doctor", text: doctorInput, timestamp: new Date() }];
      setChatHistory((prevHistory) => ({
        ...prevHistory,
        [selectedPatient._id]: updatedMessages,
      }));

      return updatedMessages;
    });

    setDoctorInput("");
  };

  useEffect(() => {
    socket.on("typing", (data) => {
      if (data.patientId === selectedPatient?._id) {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
      }
    });

    return () => {
      socket.off("typing");
    };
  }, [selectedPatient]);

  return (
    <div className='flex'>
      <div className="w-1/3 p-4 border-r border-gray-300 h-screen overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Choose a Patient</h2>
        <ul>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <li
                key={patient._id}
                className={`p-2 flex justify-between cursor-pointer shadow-white border-b ${selectedPatient?._id === patient._id ? 'bg-gray-200' : ''}`}
                onClick={() => handlePatientClick(patient)}
              >
                <span className="font-bold">{patient.name}</span>
              </li>
            ))
          ) : (
            <div className="text-gray-500">No patients available</div>
          )}
        </ul>
      </div>

      <div className="w-2/3 p-4 h-screen flex flex-col">
        <h2 className="text-center font-bold text-xl my-4">Chat with Patients</h2>
        <h2>Chat with {selectedPatient?.name || "..."}</h2>

        <div className="flex-1 mt-6 overflow-y-auto">
          {selectedPatient ? (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2 text-white rounded-lg inline-block max-w-2/3 ${message.type === 'doctor' ? 'bg-green-500' : 'bg-gray-600'}`}>
                    {message.text}
                  </div>
                </div>
              ))}
              {loading && <TypingAnimation />}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-10 text-lg">Select a patient and start chatting...</div>
          )}
        </div>

        {selectedPatient && (
          <div className="flex my-4 space-x-2">
            <input
              type="text"
              value={doctorInput}
              onChange={(e) => setDoctorInput(e.target.value)}
              placeholder="Type your message..."
              className="p-3 rounded-lg w-full text-gray-800 border border-gray-300 focus:border-gray-800"
            />
            <button
              className="text-white font-medium px-4 py-2 rounded-lg shadow-md text-xl bg-green-500 hover:bg-green-700"
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

export default DoctorChat;
