import React, { useState, useEffect } from 'react';
import { FaUser, FaBars } from "react-icons/fa";
import Sidebar from './sidebar';
import Profile from './profile';
import DashboardStats from './statsitics'

const ProfilePopup = ({ onClose }) => {
    return (
        <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="absolute inset-0 bg-gray-500 opacity-50" onClick={onClose}></div>
            <div className="relative bg-white p-6 rounded-lg shadow-lg z-10">
                <Profile />
                <button
                    className="absolute top-2 right-2 text-xl font-bold"
                    onClick={onClose}
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [message, setMessage] = useState("");
    const [isBarOpen, setIsBarOpen] = useState(false);
    const [isProfilePopupOpen, setProfilePopupOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userName, setUserName] = useState("Guest");

    const welcomeMessage = [
        `Welcome ${userName}! to InnerGlow 🎉`,
        "Stay connected with your needers ✨",
        `Hello, ${userName}! Track and celebrate your achievements 🌟`,
        `Welcome aboard! 🎉 Your success journey begins here—let’s make every moment count! 🚀`
    ];

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserName(parsedUser.name || "Guest"); 
            } catch (e) {
                console.error('Failed to parse user from localStorage:', e);
            }
        }

        const randomIndex = Math.floor(Math.random() * welcomeMessage.length);
        setMessage(welcomeMessage[randomIndex]);
    }, [userName]);

    const toggleSidebar = () => {
        setIsBarOpen(!isBarOpen);
    };

    const handleOpenProfile = () => {
        setIsProfileOpen(true);
    };

    const handleCloseProfile = () => {
        setIsProfileOpen(false);
    };

    return (
        <div>
            {isProfilePopupOpen && (
                <ProfilePopup onClose={() => setProfilePopupOpen(false)} />
            )}
            <div className='m-4 flex justify-between items-center '>
                <div className='flex items-center absolute'>
                    <button onClick={toggleSidebar}>
                        <FaBars className='text-2xl cursor-pointer' />
                    </button>
                    <Sidebar isOpen={isBarOpen} toggleSidebar={toggleSidebar} />
                </div>

                <h1 className='font-semibold text-xl text-center flex-grow'>{message}</h1>

                <div className='flex flex-col items-center space-y-2 cursor-pointer' onClick={handleOpenProfile}>
                    <FaUser className='mt-2 text-xl' />
                    <span className='font-medium'>{userName}</span>
                </div>
                {isProfileOpen && <Profile onClose={handleCloseProfile} />}
            </div>

            <div className={`navcontainer ${isBarOpen ? 'sidebarOpen' : 'sidebarClose'}`}>
            <div className="flex-grow mx-4">
              <DashboardStats />
            </div>
                <Sidebar />
            </div>
        </div>
    );
};

export default Dashboard;
