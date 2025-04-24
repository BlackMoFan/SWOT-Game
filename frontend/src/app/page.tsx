"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [team, setTeam] = useState('');
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    if (username && team) {
      // Initialize team-specific data in localStorage if not already present
      const existingData = JSON.parse(localStorage.getItem('factors') || '{}');
      if (!existingData[team]) {
        existingData[team] = {
          scores: {}, // Object to store scores for each factor
          reasons: {}, // Object to store reasons for each factor
        };
      }

      // Save user data and team-specific data to localStorage
      localStorage.setItem('user', JSON.stringify({ username, team }));
      localStorage.setItem('factors', JSON.stringify(existingData));

      // Redirect to Stage 1
      router.push('/stage1');
    } else {
      // alert('Please enter your name and select a team.');
      setShowToast(true);
      // Hide the toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">SWOT Simulation Game</h1>
        <p className="text-lg mt-2">Welcome to the Finsimco SWOT Simulation Game</p>
      </div>

      {/* Login Form */}
      <div className="bg-white text-black p-6 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Name:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Team:</label>
          <select
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="" disabled>
              Select your team
            </option>
            <option value="team 1">Business Development Team</option>
            <option value="team 2">Risk Management Team</option>
          </select>
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Log In
        </button>
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-red-400 text-white px-4 py-2 rounded shadow-lg">
            Please enter your name and select a team.
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;