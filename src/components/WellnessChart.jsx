import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import api from '../services/api';

// Register the necessary components for Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const WellnessChart = () => {
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const { data } = await api.get('/api/v1/check-ins/summary');
                if (data && data.length > 0) {
                    // Process the data for the chart
                    const labels = data.map(d => new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                    const moodData = data.map(d => d.mood);
                    const energyData = data.map(d => d.energy);

                    setChartData({
                        labels,
                        datasets: [
                            {
                                label: 'Mood',
                                data: moodData,
                                borderColor: 'rgb(75, 192, 192)',
                                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                                tension: 0.1
                            },
                            {
                                label: 'Energy',
                                data: energyData,
                                borderColor: 'rgb(255, 99, 132)',
                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                tension: 0.1
                            },
                        ],
                    });
                }
            } catch (err) {
                setError('Could not load chart data.');
                console.error(err);
            }
        };

        fetchChartData();
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '7-Day Wellness Trend',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 10
            }
        }
    };

    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
    if (!chartData) return <div className="p-4 text-center text-gray-500">Loading chart...</div>;

    return <Line options={options} data={chartData} />;
};

export default WellnessChart;
