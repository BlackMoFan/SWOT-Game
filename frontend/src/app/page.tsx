"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { FaGithub, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';

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
      <div className="absolute top-4 right-4">
        <Link 
          href="https://github.com/BlackMoFan/SWOT-Game" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white hover:text-gray-200 transition-colors flex items-center gap-2 border-2 border-white rounded-xl p-2"
        >
          <FaGithub className="text-2xl" />
        </Link>
      </div>
    </div>

    <div className="flex gap-8">
      {/* Login Form */}
      <div className="bg-white text-black p-6 rounded shadow-lg w-96 flex flex-col justify-center">
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

          <div className="space-y-2 mt-4">
            <div className="p-2 bg-blue-200 rounded">
              <p className="text-sm text-blue-800 font-semibold">
                Note: Both teams must complete their inputs before proceeding to the next stage.
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded">
              <p className="text-sm text-yellow-800 flex items-center">
                <FaInfoCircle className="mr-2 text-3xl" />
                This game uses browser localStorage to persist data. Clearing your browser data will reset the game.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    {showToast && (
      <div className="fixed bottom-4 right-4 bg-red-400 text-white px-4 py-2 rounded shadow-lg">
        Please enter your name and select a team.
      </div>
    )}

    <div className="fixed bottom-0 left-0 right-0 bg-red-100 border-t border-red-400 text-red-700 text-sm px-4 py-2">
      <div className="flex items-center justify-center">
        <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
        </svg>
        <p className="font-medium">
          Please note: This application is optimized for desktop viewing. Mobile responsiveness is currently in development.
        </p>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;