// ChatHistory.js
import React from 'react';

const VentHistory = ({ chatHistory, onDateClick }) => {
    return (
        <div className="w-1/3 p-4 shadow-white border-2 border-r-black h-screen overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Chat History</h3>
            <div className="space-y-2">
                {Object.keys(chatHistory).map(date => (
                    <div key={date}>
                        <button
                            className="w-full text-left p-2 shadow-white rounded-lg"
                            onClick={() => onDateClick(date)}
                        >
                            {date}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VentHistory;
