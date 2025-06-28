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

// The component now accepts check-in data as a prop
const WellnessChart = ({ checkInData }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        // Process the data when the prop is available
        if (checkInData && checkInData.length > 0) {
            const labels = checkInData.map(d => new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            const moodData = checkInData.map(d => d.mood);
            const energyData = checkInData.map(d => d.energy);

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
        } else {
            setChartData(null); // Clear chart if no data
        }
    }, [checkInData]); // Re-run this effect whenever the checkInData prop changes

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

    if (!checkInData || checkInData.length === 0) {
        return <div className="p-4 text-center text-gray-500">No recent check-in data to display.</div>;
    }

    if (!chartData) {
        return <div className="p-4 text-center text-gray-500">Processing chart data...</div>;
    }

    return <Line options={options} data={chartData} />;
};

export default WellnessChart;
