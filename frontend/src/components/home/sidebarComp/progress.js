import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../axiosInstance';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const EmotionProgressChart = ({ userId }) => {
  const [emotionData, setEmotionData] = useState({});

  useEffect(() => {
    axiosInstance.get(`/progress/${userId}`)
      .then(response => {
        setEmotionData(response.data);
      })
      .catch(err => console.error(err));
  }, [userId]);

  // Prepare data for the chart
  const dates = Object.keys(emotionData);
  const emotionTypes = [
    "Happy", "Sad", "Angry", "Relaxed", "Stressed", "Crying", "Loving", "Fear", "Disgust", "Surprise"
  ];

  const chartData = {
    labels: dates,
    datasets: emotionTypes.map((emotion, index) => ({
      label: emotion,
      data: dates.map(date => emotionData[date][emotion] || 0),
      borderColor: `hsl(${index * 36}, 70%, 50%)`,
      fill: false,
    })),
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2 className='text-center font-bold text-xl my-4'>Emotion Progress Chart</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default EmotionProgressChart;
