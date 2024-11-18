import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../axiosInstance';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const EmotionSummaryChart = () => {
  const [emotionData, setEmotionData] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    axiosInstance.get(`/progress/${userInfo.id}`)
      .then(response => {
        setEmotionData(response.data);
      })
      .catch(err => console.error(err));
  }, []);

  // Prepare data for the chart
  const labels = emotionData.map(item => item.emotion);
  const percentages = emotionData.map(item => parseFloat(item.percentage)); // Use percentages

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Emotion Percentage (%)',
        data: percentages,
        backgroundColor: '#FF8042',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100, 
        ticks: {
          callback: function(value) {
            return value + '%'; 
          }
        }
      },
    },
  };

  return (
    <div>
      <h2 className='text-center font-bold text-xl my-4'>Emotion Summary Chart (Percentage)</h2>
      <Bar data={chartData} options={options}/>
    </div>
  );
};

export default EmotionSummaryChart;
