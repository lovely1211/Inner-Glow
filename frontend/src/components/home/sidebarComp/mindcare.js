import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../axiosInstance';

const Mindcare = () => {
    const [suggestion, setSuggestion] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const fetchSuggestion = async () => {
            try {
                const response = await axiosInstance.get(`/suggestions/${userInfo.id}`);
                setSuggestion(response.data.suggestion);
                console.log(response)
            } catch (err) {
                setError('Failed to load suggestion. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestion();
    }, []);

    if (loading) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Monthly Suggestion</h2>
            <p className="text-gray-700">{suggestion}</p>
        </div>
    );
};

export default Mindcare;
