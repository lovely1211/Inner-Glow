import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../axiosInstance';
import ChatHistory from './ventHistory';

const Vent = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null); 
    const [chatHistory, setChatHistory] = useState({});

    const params = new URLSearchParams(window.location.search);
    const initialInput = params.get('input') || '';

    useEffect(() => {
        if (initialInput) {
            setMessages(prevMessages => [...prevMessages, { type: 'user', text: initialInput }]);
            fetchChatGPTResponse(initialInput);
        }
    }, [initialInput]);

    const fetchChatGPTResponse = async (input) => {
        setLoading(true);
        const maxRetries = 3;
        let attempt = 0;
        let delay = 1000;

        while (attempt < maxRetries) {
            try {
                const response = await axiosInstance.post('/chat', { message: input });
                setMessages(prevMessages => [
                    ...prevMessages,
                    { type: 'chatgpt', text: response.data.reply, timestamp: new Date() }
                ]);
                break;
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    attempt++;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2;
                } else {
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { type: 'error', text: "Error: Unable to fetch response." }
                    ]);
                    break;
                }
            }
        }
        setLoading(false);
    };

    const handleSend = () => {
        if (!userInput || loading) return;

        const newMessage = { type: 'user', text: userInput, timestamp: new Date() };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        fetchChatGPTResponse(userInput);
        setUserInput("");
    };

    // Group messages by date
    useEffect(() => {
        const groupedMessages = messages.reduce((acc, message) => {
            const date = message.timestamp ? message.timestamp.toDateString() : 'Unknown Date';
            if (!acc[date]) acc[date] = [];
            acc[date].push(message);
            return acc;
        }, {});

        setChatHistory(groupedMessages);
    }, [messages]);

    // Select date for chat view
    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    return (
        <div className="flex">
            <ChatHistory chatHistory={chatHistory} onDateClick={handleDateClick} /> 

            {/* Main Chat Section */}
            <div className="w-2/3 p-4 h-screen flex flex-col">
                <h2 className="text-2xl text-center font-semibold mt-4">Chat with Me</h2>
                <div className="flex-1 mt-6 overflow-y-auto">
                    <div className="space-y-4 max-w-full">
                        {(selectedDate ? chatHistory[selectedDate] : messages).map((message, index) => (
                            <div
                                key={index}
                                className={`${
                                    message.type === 'user' ? 'text-right bg-blue-400' : 'text-left bg-gray-600'
                                } p-3 text-white rounded-lg`}
                            >
                                {message.text}
                            </div>
                        ))}
                        {loading && <div className="text-center text-gray-300">...</div>}
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
