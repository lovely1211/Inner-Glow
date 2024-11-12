import React, { useState } from 'react';
import axiosInstance from '../../../axiosInstance';

const Contact = () => {
  const [formData, setFormData] = useState({
    queryType: '',
    name: '',
    email: '',
    message: '',
    isMember: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/service/sendQuery', formData);
      alert('Your query has been sent successfully!');
      setFormData({
        queryType: '',
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      alert('Failed to send your query. Please try again.');
      console.error('Error sending query:', error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='flex flex-col justify-center items-center border-2 rounded-2xl border-white shadow-white w-1/3 p-3 m-4 text-black'>
        <div className='text-white text-3xl font-bold text-center m-1'>Contact Us</div>
        <form onSubmit={handleSubmit}>
          <div className="m-1 p-2 text-center">
            <select
              name="queryType"
              id="query"
              value={formData.queryType}
              onChange={handleChange}
              className='border-2 border-black p-2 w-[100%] rounded-lg'
            >
              <option value="">Type of Query</option>
              <option value="Site related Issues">Site related Issues</option>
              <option value="Complaint related Issues">Complaint related Issues</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="m-1 p-2 text-center">
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your Name"
              value={formData.name}
              onChange={handleChange}
              className='p-2 w-[100%] rounded-lg border-2 border-black'
            />
          </div>

          <div className="m-1 p-2 text-center">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className='p-2 w-[100%] rounded-lg border-2 border-black'
            />
          </div>

          <div className="m-1 p-2 text-center">
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              className='p-2 w-[100%] rounded-lg border-2 border-black'
              cols="30"
              rows="10"
              placeholder='Elaborate your query...'
            />
          </div>

          <div id="btn" className='m-3 text-center'>
            <input
              type="submit"
              value="Submit"
              className='h-10 w-[95%] border-2 border-black bg-white text-gray-800 shadow-white cursor-pointer font-semibold text-2xl rounded-lg mx-1 transition-all duration-400 hover:text-xl'
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
