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

      // Set flag for first login to show mission modal
      localStorage.setItem('showMissionModal', 'true');

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

    <div className="flex gap-8">
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
        
      </div>
      {/* Game Mechanics Info Panel */}
      <div className="bg-white/90 text-black p-6 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Game Mechanics</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-lg text-blue-600">Stage 1: Analysis and Due Diligence</h3>
            <ul className="list-disc ml-4 text-sm space-y-2">
              <li>Log in as one team first</li>
              <li>Input scores and reasons for each factor</li>
              <li>Log out and switch to the other team</li>
              <li>Input the other team&apos;s data</li>
              <li>Once both teams have saved their data, &quot;Go to Next Stage&quot; becomes available</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg text-blue-600">Stage 2: Structuring</h3>
            <ul className="list-disc ml-4 text-sm space-y-2">
              <li><span className="font-semibold">Business Development Team:</span> Can adjust scores and view Risk Management approval status</li>
              <li><span className="font-semibold">Risk Management Team:</span> Can view scores and toggle Okay/TBD status</li>
              <li>When both factors are &quot;Okay-ed&quot;, Approval section appears</li>
              <li>Risk Management Team can finalize the agreement</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg text-blue-600">Stage 3: Summary</h3>
            <ul className="list-disc ml-4 text-sm space-y-2">
              <li>View final agreed scores and reasons</li>
              <li>Option to start another round</li>
            </ul>
          </div>

          <div className="mt-4 p-2 bg-blue-200 rounded">
            <p className="text-sm text-blue-800 font-semibold">
              Note: Both teams must complete their inputs before proceeding to the next stage.
            </p>
          </div>
        </div>
      </div>
    </div>
    {showToast && (
      <div className="fixed bottom-4 right-4 bg-red-400 text-white px-4 py-2 rounded shadow-lg">
        Please enter your name and select a team.
      </div>
    )}
    </div>
  );
};

export default LoginPage;