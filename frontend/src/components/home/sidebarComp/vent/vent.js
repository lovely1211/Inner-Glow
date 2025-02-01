import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../axiosInstance';
import ChatHistory from './ventHistory';

const TypingAnimation = () => (
    <div className="text-center text-gray-500">
        <span>Typing</span>
        <span className="animate-pulse">...</span>
    </div>
);

const Vent = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null); 
    const [chatHistory, setChatHistory] = useState({});
    const [error, setError] = useState(null);

    const params = new URLSearchParams(window.location.search);
    const initialInput = params.get('input') || '';

    
    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('chatHistory')) || {};
        console.log(storedHistory)
        setChatHistory(storedHistory);
    }, []);
    
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const fetchChatHistory = async () => {
            try {
                const response = await axiosInstance.get(`/chat/${userInfo.id}`); 
                const groupedChats = groupChatsByDate(response.data);
                setChatHistory(groupedChats);
            } catch (err) {
                console.error('Error fetching chat history:', err);
                setError('Failed to load chat history');
            }
        };

        if (userInfo.id) {
            fetchChatHistory();
        }
    }, []); 

    const groupChatsByDate = (chats) => {
        return chats.reduce((acc, chat) => {
            const date = new Date(chat.timestamp).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(chat);
            return acc;
        }, {});
    };

    useEffect(() => {
        if (Object.keys(chatHistory).length > 0) {
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        }
    }, [chatHistory]);

    useEffect(() => {
        if (initialInput) {
            setMessages(prevMessages => [...prevMessages, { type: 'user', text: initialInput }]);
            fetchChatGPTResponse(initialInput);
        }
    }, [initialInput]);

    const fetchChatGPTResponse = async (input) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo?.id) {
            setMessages(prevMessages => [...prevMessages, { type: 'error', text: "User ID is missing" }]);
            return;
        }
    
        setLoading(true); // Start typing animation
    
        try {
            const response = await axiosInstance.post('/chat', {
                message: input,
                userId: userInfo.id
            });
            const reply = response.data.reply || "No reply generated";
            setMessages(prevMessages => [...prevMessages, { type: 'chatgpt', text: reply, timestamp: new Date() }]);
        } catch (error) {
            console.error("Error:", error);
            setMessages(prevMessages => [...prevMessages, { type: 'error', text: "Error: Unable to fetch response." }]);
        } finally {
            setLoading(false); // Stop typing animation
        }
    };

    const handleSend = () => {
        if (!userInput || loading) return;

        const newMessage = { type: 'user', text: userInput, timestamp: new Date() };
        setMessages(prevMessages => {
            const updatedMessages = [...prevMessages, newMessage];

            const currentDate = new Date().toISOString().split('T')[0];
            setChatHistory(prevHistory => ({
                ...prevHistory,
                [currentDate]: updatedMessages
            }));

            return updatedMessages;
        });
        fetchChatGPTResponse(userInput);
        setUserInput("");
    };

    useEffect(() => {
        const groupedMessages = messages.reduce((acc, message) => {
            const date = message.timestamp ? message.timestamp.toDateString() : 'Unknown Date';
            if (!acc[date]) acc[date] = [];
            acc[date].push(message);
            return acc;
        }, {});

        setChatHistory(groupedMessages);
    }, [messages]);

    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    return (
        <div className="flex">
            {error ? <p>{error}</p> : <ChatHistory chatHistory={chatHistory} onDateClick={handleDateClick} />}

            <div className="w-2/3 p-4 h-screen flex flex-col">
                <h2 className="text-2xl text-center font-semibold mt-4">Chat with Me</h2>
                <div className="flex-1 mt-6 overflow-y-auto">
                    <div className="space-y-4">
                        {(selectedDate ? chatHistory[selectedDate] || [] : messages || []).map((message, index) => (
                            <div key={index} className={`${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                                <div
                                    className={`${message.type === 'user' ? 'bg-blue-400' : 'bg-gray-600'} p-2 text-white rounded-lg inline-block max-w-1/2`}
                                >
                                    {typeof message.text === 'string' ? message.text : JSON.stringify(message.text)}
                                </div>
                            </div>
                        ))}

                        {loading && <TypingAnimation />}
                    </div>
                </div>
                <div className="flex my-4 space-x-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your message..."
                        className="p-3 rounded-lg w-full text-gray-800 border border-gray-300 focus:border-gray-800"
                    />
                    <button
                        className="text-gray-800 font-medium px-4 py-2 rounded-lg shadow-md text-xl text-white bg-blue-500 hover:bg-blue-700"
                        onClick={handleSend}
                        disabled={loading}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Vent;
