import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Charts({ salesData }) {
  const [selectedView, setSelectedView] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  const allDates = salesData.map(sale => new Date(sale.date));
  const minDate = allDates.length ? new Date(Math.min(...allDates)) : null;
  const maxDate = allDates.length ? new Date(Math.max(...allDates)) : null;

  const formatDate = (date, formatType) => {
    if (formatType === 'week' || formatType === 'month') {
      return `${new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(date)} ${date.getFullYear()}`;
    } else if (formatType === 'year') {
      return `${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)} ${date.getFullYear()}`;
    }
  };

  const generateLabels = () => {
    let labels = [];
    let tempDate = new Date(currentDate);

    if (selectedView === 'week') {
      tempDate.setDate(tempDate.getDate() - tempDate.getDay());
      for (let i = 0; i < 7; i++) {
        labels.push(formatDate(new Date(tempDate), 'week'));
        tempDate.setDate(tempDate.getDate() + 1);
      }
    } else if (selectedView === 'month') {
      tempDate.setDate(1);
      while (tempDate.getMonth() === currentDate.getMonth()) {
        labels.push(formatDate(new Date(tempDate), 'month'));
        tempDate.setDate(tempDate.getDate() + 1);
      }
    } else if (selectedView === 'year') {
      tempDate.setMonth(0);
      for (let i = 0; i < 12; i++) {
        labels.push(formatDate(new Date(tempDate), 'year'));
        tempDate.setMonth(tempDate.getMonth() + 1);
      }
    }
    return labels;
  };

  const getHeading = () => {
    let tempDate = new Date(currentDate);
    if (selectedView === 'week') {
      const startDate = new Date(tempDate);
      startDate.setDate(tempDate.getDate() - tempDate.getDay());
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      return `${formatDate(startDate, 'week')} - ${formatDate(endDate, 'week')}`;
    } else if (selectedView === 'month') {
      const startDate = new Date(tempDate);
      startDate.setDate(1);
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1);
      endDate.setDate(0);
      return `${formatDate(startDate, 'month')} - ${formatDate(endDate, 'month')}`;
    } else if (selectedView === 'year') {
      return `${currentDate.getFullYear()}`;
    }
  };

  const groupedSales = {};
  salesData.forEach((sale) => {
    const saleDate = new Date(sale.date);
    if (saleDate.getFullYear() === currentDate.getFullYear()) {
      let key = formatDate(saleDate, selectedView);
      groupedSales[key] = (groupedSales[key] || 0) + sale.todaySale;
    }
  });

  const labels = generateLabels();
  const dataValues = labels.map((label) => groupedSales[label] || 0);

  const hasPreviousData = minDate && currentDate > minDate;
  const hasNextData = maxDate && currentDate < maxDate;

  const chartData = {
    labels,
    datasets: [
      {
        label: `${selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} Sales`,
        data: dataValues,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Sales Performance (${selectedView})` },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Amount ($)' },
      },
      x: {
        title: { display: true, text: selectedView.charAt(0).toUpperCase() + selectedView.slice(1) },
      },
    },
  };

  const navigateTimePeriod = (direction) => {
    let newDate = new Date(currentDate);
    if (selectedView === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'prev' ? -7 : 7));
    } else if (selectedView === 'month') {
      newDate.setMonth(currentDate.getMonth() + (direction === 'prev' ? -1 : 1));
    } else if (selectedView === 'year') {
      newDate.setFullYear(currentDate.getFullYear() + (direction === 'prev' ? -1 : 1));
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-4 text-center">📊 Sales Analytics</h2>
      
      <div className="bg-gray-100 p-2 rounded-lg mb-6 flex space-x-4">
        {['week', 'month', 'year'].map((view) => (
          <button
            key={view}
            onClick={() => { setSelectedView(view); setCurrentDate(new Date()); }}
            className={`px-6 py-2 rounded-lg font-semibold transition ${selectedView === view ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="flex justify-between items-center w-full max-w-xl mb-4">
        <button 
          onClick={() => navigateTimePeriod('prev')} 
          className={`px-4 py-2 rounded ${hasPreviousData ? 'bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} 
          disabled={!hasPreviousData}
        >
          ← Previous
        </button>
        <span className="font-semibold text-lg">
          {getHeading()}
        </span>
        <button 
          onClick={() => navigateTimePeriod('next')} 
          className={`px-4 py-2 rounded ${hasNextData ? 'bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} 
          disabled={!hasNextData}
        >
          Next →
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="w-full h-96">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}

export default Charts;