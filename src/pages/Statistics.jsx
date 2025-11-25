import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './statistics.css';

// Register Chart.js components and plugin
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const Statistics = () => {
  const [statistics, setStatistics] = useState({
    revues: 0,
    ouvrages: 0,
    projets: 0,
    rapports: 0,
    brevets: 0,
    conferences: 0,
    seminaires: 0,
    members: 0,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/statistics');
        setStatistics(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  const data = {
    labels: ['Revues', 'Ouvrages', 'Projets', 'Rapports', 'Brevets', 'Conférences', 'Séminaires', 'Membres'],
    datasets: [
      {
        label: 'Statistics',
        data: [
          statistics.revues,
          statistics.ouvrages,
          statistics.projets,
          statistics.rapports,
          statistics.brevets,
          statistics.conferences,
          statistics.seminaires,
          statistics.members,
        ],
        backgroundColor: 'rgba(135, 206, 250, 0.7)',
        borderColor: 'rgba(135, 206, 250, 1)',
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(135, 206, 250, 1)',
        hoverBorderColor: 'rgba(135, 206, 250, 1)',
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold',
            family: 'Arial, sans-serif',
          },
        },
      },
      title: {
        display: true,
        text: 'Statistics Overview',
        font: {
          size: 24,
          weight: 'bold',
          family: 'Arial, sans-serif'
        },
        color: '#333',
        padding: {
          top: 80,
          bottom: 30,
        },
      },
      datalabels: {
        anchor: 'end',
        align: 'start',
        color: '#000',
        font: {
          size: 16,
          weight: 'bold',
        },
        formatter: (value) => value,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 14 },
        cornerRadius: 4,
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          font: {
            size: 14,
          },
          beginAtZero: true,
        },
        grid: {
          color: 'rgba(135, 206, 250, 0.2)',
        },
      },
    },
    animation: {
      duration: 2000, // Duration of the animation
      easing: 'easeOutQuart', // Easing function
    },
  };

  return (
    <div className="p-5" style={{ height: '500px', width: '80%' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Statistics;
