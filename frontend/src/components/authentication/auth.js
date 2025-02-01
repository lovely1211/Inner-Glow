import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import './auth.css';
import teddyIdle from '../../assets/bear-sad.gif';
import teddyDance from '../../assets/bear-dance.gif';
import DoctorAuth from './doctor';

const Auth = ({ onLogin }) => {
  const [isUserAuth, setIsUserAuth] = useState(true);
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const toggleAuthPage = () => {
    setIsLoginPage(!isLoginPage);
  };

  const toggleLoginPage = () => {
    setIsUserAuth(!isUserAuth);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    const isFormValid = isLoginPage
      ? updatedFormData.email && updatedFormData.password
      : updatedFormData.name &&
        updatedFormData.email &&
        updatedFormData.age &&
        updatedFormData.password &&
        updatedFormData.confirmPassword &&
        updatedFormData.password === updatedFormData.confirmPassword;

    setIsValid(isFormValid);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      const { data } = await axiosInstance.post('/signup', {
        name: formData.name,
        email: formData.email,
        age: formData.age,
        password: formData.password,
      });
      alert('Registration successful!');
      localStorage.setItem('userInfo', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      const normalizedEmail = formData.email.toLowerCase();
      const { data } = await axiosInstance.post('/signin', {
        email: normalizedEmail,
        password: formData.password,
      });
      alert('Login successful!');
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const generateBubbles = () => {
    const bubbles = [];
    for (let i = 0; i < 30; i++) {
      const size = Math.random() * 30 + 10;
      const left = Math.random() * 100;
      const animationDelay = `${Math.random() * 5}s`;
      bubbles.push(
        <div
          key={i}
          className="bubble"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            animationDelay,
          }}
        ></div>
      );
    }
    return bubbles;
  };

  return (
    <div className="relative h-screen w-screen overflow-y">
      <div className="absolute inset-0 flex items-center justify-center">
        {isUserAuth ? (
          <form
            className="w-1/3 p-8 bg-white text-gray-800 shadow-lg rounded-lg z-10"
            onSubmit={isLoginPage ? handleLogin : handleRegister}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              Welcome {isLoginPage && 'Back'} To Inner Glow
            </h2>
            {!isLoginPage && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="text"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            {!isLoginPage && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium">Age</label>
                <select
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">-- Select Age Range --</option>
                  <option value="0-12">0-12 (Child)</option>
                  <option value="13-19">13-19 (Teen)</option>
                  <option value="20-35">20-35 (Young Adult)</option>
                  <option value="36-50">36-50 (Adult)</option>
                  <option value="51+">51+ (Senior)</option>
                </select>
              </div>
            )}
            <div className="relative mb-4">
              <label className="block text-gray-700 font-medium">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2/3 transform -translate-y-1/2 bg-gray-200 p-1 rounded"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {!isLoginPage && (
              <div className="relative mb-4">
                <label className="block text-gray-700 font-medium">Confirm Password</label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-2/3 transform -translate-y-1/2 bg-gray-200 p-1 rounded"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            )}
            <button
              type="submit"
              className={`w-full py-2 rounded-md text-white font-bold transition-all text-xl ${
                isValid ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400'
              }`}
              disabled={!isValid}
            >
              {isLoginPage ? 'Sign in' : 'Sign up'}
            </button>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            <div>
              <p className="text-sm text-gray-500 mt-4">
                {isLoginPage ? "Don't have an account? " : 'Already have an account? '}
                <span
                  className="text-blue-500 underline cursor-pointer"
                  onClick={toggleAuthPage}
                >
                  {!isLoginPage ? 'Sign in' : 'Sign up'}
                </span>
              </p>
            </div>
          </form>
        ) : (
          <DoctorAuth />
        )}

        {/* Teddy Animation */}
        <div className="w-1/2 flex justify-center items-center z-10">
          <img
            src={isValid ? teddyDance : teddyIdle}
            alt="Teddy Animation"
            className="w-64 h-64"
          />
        </div>
      </div>
      
      {/* Toggle Buttons */}
      <div className="absolute items-center flex justify-center mt-4 right-8" onClick={toggleLoginPage}>
        <button
          className={`z-10 cursor-pointer w-[200px] px-4 py-2 text-xl font-medium rounded-l-lg cursor-pointer ${
            isUserAuth ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400'
          }`}
          onClick={() => setIsUserAuth(true)}
        >
          For User
        </button>
        <button
          className={`z-10 cursor-pointer w-[200px] px-4 py-2 text-xl font-medium rounded-r-lg ${
            !isUserAuth ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400'
          }`}
          onClick={() => setIsUserAuth(false)}
        >
          For Doctor
        </button>
      </div>

      {/* Bubble Background */}
      <div className="absolute inset-0">{generateBubbles()}</div>
    </div>
  );
};

export default Auth;
