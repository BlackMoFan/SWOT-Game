"use client"; // Ensure this is a Client Component

import React, { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa';
import { useRouter, usePathname } from 'next/navigation';

const TopBar: React.FC = () => {
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour in seconds
  const [userInfo, setUserInfo] = useState<{ username: string; team: string }>({
    username: 'Firstname LASTNAME',
    team: 'Team 1',
  });
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

  // Determine the stage name based on the current path
  const stageName =
    pathname === '/stage1'
      ? 'Analytics & Due Diligence'
      : pathname === '/stage2'
      ? 'Structuring'
      : '';

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, []);

  // Retrieve user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user data from localStorage
    router.push('/'); // Redirect to the root page
  };

  return (
    <div className="bg-blue-800 text-white p-4 flex items-center justify-between">
      {/* Timer */}
      <div className="flex items-center">
        <span className="text-lg font-bold">{formatTime(timeRemaining)} Remaining</span>
        <FaClock className="ml-2 text-2xl" />
      </div>

      {/* Stage Name */}
      <div className="text-lg font-bold">{stageName}</div>

      {/* Player Info */}
      <div>
        <div className="text-lg font-bold">{userInfo.username}, {userInfo.team}</div>
        <button
          onClick={handleLogout}
          className="text-sm text-orange-400 hover:underline cursor-pointer"
        >
          LOG OUT
        </button>
      </div>
    </div>
  );
};

export default TopBar;