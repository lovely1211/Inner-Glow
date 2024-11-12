import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axiosInstance from '../../axiosInstance';

const WeeklyChart = () => {
    const [weeklyData, setWeeklyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeeklyEmotions = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const response = await axiosInstance.get(`/emotion/last-seven-days/${userInfo.id}`);
                setWeeklyData(response.data);  
            } catch (error) {
                console.error('Error fetching weekly emotions:', error);
            } finally {
                setLoading(false);
            }
        };        
        fetchWeeklyEmotions();
    }, []);

    const COLORS = ['#0088FE', '#FF8042', '#FFBB28', '#10375C', '#FF5C93', '#A52A2A', '#9400D3', '#605678', '#AB886D', '#4C4B16'];
    const emotionLabels = ['Happy', 'Sad', 'Angry', 'Relaxed', 'Stressed', 'Crying', 'Loving', 'Fear', 'Disgust', 'Surprise'];

    const pieData = Array.isArray(weeklyData)
    ? weeklyData.map((day) => ({
        name: day.day,
        value: day.count,
        emotion: day.emotion,
    }))
    : [];

    return (
    <div className="m-10">
        <h2 className="text-center mb-4">Weekly Emotional Response</h2>
        {loading ? (
            <p>Loading...</p>
        ) : pieData.length === 0 ? (
            <p>No data available for the past week.</p>
        ) : (
            <PieChart width={400} height={400}>
                <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    labelLine={false}
                >
                    {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend
                    payload={emotionLabels.map((emotion, index) => ({
                        value: emotion,
                        type: "square",
                        color: COLORS[index],
                    }))}
                />
            </PieChart>
        )}
    </div>

    );
};

export default WeeklyChart;