import React, { useEffect, useState } from 'react';
import {FaUser} from "react-icons/fa";
import Logout from './logout';
import axiosInstance from '../../axiosInstance';

const Profile = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setFormData({
          name: parsedUser.name || '',
          age: parsedUser.age || '',
          email: parsedUser.email || '',
          
        });
      } catch (e) {
        console.error('Failed to parse user from localStorage:', e);
      }
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>; 
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSaveClick = async () => {
    try {
      const response = await axiosInstance.put(`/${user._id}`, formData);
      const updatedUser = response.data;

      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
        <div className="relative bg-white text-gray-800 p-3 rounded-lg shadow-lg w-1/3">
          <button onClick={onClose} className="absolute top-3 right-3 text-2xl font-bold px-1 border-2 border-black rounded-md">
            &times; 
          </button>
          <div className="text-red-600 text-4xl font-bold text-center m-2">
            {isEditing ? 'Edit Profile' : 'User Profile'}
          </div>
          <div className="w-full flex justify-center mt-2">
            <FaUser
              className="w-32 h-32 rounded-full border-2 border-black object-cover"
            />
          </div>
          <div className="m-4 p-2">
            {isEditing ? (
              <>
                <p><strong>Name: </strong>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-1 rounded"
                  />
                </p>
                <p><strong>Age: </strong>
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="border p-1 rounded"
                  />
                </p>
                <p><strong>Email: </strong>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border p-1 rounded"
                  />
                </p>
                <button
                  onClick={handleSaveClick}
                  className="bg-green-500 hover:bg-green-700 text-white p-2 rounded mt-3 w-1/2 font-bolt text-xl"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <p><strong>Name: </strong> {user.name}</p>
                <p><strong>Age: </strong> {user.age}</p>
                <p><strong>Email: </strong> {user.email}</p>
                <div className='flex flex-row justify-between'>
                 <button
                  onClick={handleEditClick}
                  className="border-2 border-black rounded-xl hover:bg-blue-800 bg-blue-600 text-white font-bold p-2  text-xl mt-4 mx-2 w-1/4">
                  Edit
                 </button>
                 <Logout />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
