import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

const Auth = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    experience: '',
    fees :'',
    password: '',
    confirmPassword: '',
  });  
  const navigate = useNavigate();

  const toggleAuthPage = () => {
    setIsLoginPage(!isLoginPage);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
  
    if (isLoginPage) {
      // On login page, only validate email and password
      if (updatedFormData.email && updatedFormData.password) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    } else {
      // On registration page, validate name, email, password, and confirmPassword
      if (
        updatedFormData.name &&
        updatedFormData.email &&
        updatedFormData.specialization &&
        updatedFormData.experience &&
        updatedFormData.fees &&
        updatedFormData.password &&
        updatedFormData.confirmPassword &&
        updatedFormData.password === updatedFormData.confirmPassword
      ) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    }
  };      

  const handleRegister = async(event) => {
    event.preventDefault();
    if(!formData.name || !formData.email || !formData.specialization  || !formData.experience || !formData.fees || !formData.password || !formData.confirmPassword){
      alert("Please fill all the fields below.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      
      const capitalizedName = (formData.name).replace(/\b\w/g, c => c.toUpperCase());
      const newFormData = new FormData();
      newFormData.append('name', formData.capitalizedName);
      newFormData.append('email', formData.email);
      newFormData.append('specialization', formData.specialization);
      newFormData.append('experience', formData.experience);
      newFormData.append('fees', formData.fees);
      newFormData.append('password', formData.password);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axiosInstance.post("/doctor/signup", formData, config);
      alert("Registration successful");
      
      localStorage.setItem("userInfo", JSON.stringify(data.user)); 
      window.location.href = '/'; 
    }catch (error){
      console.log(error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const normalizedEmail = formData.email.toLowerCase();
      const response = await axiosInstance.post('/doctor/signin', { email: normalizedEmail, password: formData.password }, formData, config);  
      const { token } = response.data;
  
      alert("Loggedin successful");
      localStorage.setItem('token', token);
      localStorage.setItem("userInfo", JSON.stringify(response.data.user)); 
      navigate('/');
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <>
        {/* Form Section */}
        <form
          className="w-1/3 p-8 bg-white text-gray-800 shadow-lg rounded-lg z-10"
          onSubmit={!isLoginPage ? handleRegister : handleLogin}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Welcome {isLoginPage && `Back`} To Inner Glow
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
              <label className="block text-gray-700 font-medium">Specialization</label>
              <select
                value={formData.specialization}
                name="specialization"
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">-- Select Your Specialization --</option>
                <option value="psychologist">Psychologist</option>
                <option value="counselor">Counselor</option>
                <option value="therapist">Therapist</option>
                <option value="clinicalSocialWorker">Clinical Social Worker</option>
                <option value="lifeCoach">Life Coach</option>
                <option value="holisticHealer">Holistic Healer</option>
                <option value="occupationalTherapist">Occupational Therapist</option>
                <option value="neurologist">Neurologist</option>
              </select>
            </div>
          )}
          {!isLoginPage && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Experience (in years)</label>
              <input
                type="text"
                name="experience"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.experience}
                onChange={handleInputChange}
              />
            </div>
          )}
          {!isLoginPage && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Fees (in rupees)</label>
              <input
                type="text"
                name="fees"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.fees}
                onChange={handleInputChange}
              />
            </div>
          )}
          <div className="relative mb-4">
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
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
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {!isLoginPage && (
            <div className="relative mb-4">
              <label className="block text-gray-700 font-medium">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
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
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          )}
          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white font-bold transition-all text-xl ${
              isValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400"
            }`}
            disabled={!isValid}
          >
            {isLoginPage ? `Sign in` : `Sign up`}
          </button>
  
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
  
          <div>
            <p className="text-sm text-gray-500 mt-4">
              {isLoginPage
                ? `Don't have an account? `
                : `Already have an account? `}
              <span
                className="text-blue-500 underline cursor-pointer"
                onClick={toggleAuthPage}
              >
                {!isLoginPage ? "Sign in" : "Sign up"}
              </span>
            </p>
          </div>
        </form>
      </>
  );
  
};

export default Auth;
