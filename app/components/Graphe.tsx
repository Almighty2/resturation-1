import React from 'react';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Données pour le graphique
const data = {
  labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet'],
  datasets: [
    {
      label: 'Ventes 2023',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ],
};

// Options pour le graphique
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true,
      text: 'Ventes mensuelles 2023',
    },
  },
};
// Composant Graphe
export default function Graphe() {
    return (
        <div className="mt-2">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg mb-4 font-semibold"></h3>
                <Bar data={data} options={options} />
        </div>
    </div>
    );
  }
