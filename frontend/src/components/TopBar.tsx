"use client"; 

import React, { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa';
import { useRouter, usePathname } from 'next/navigation';

const TopBar: React.FC = () => {
  const [timeRemaining, setTimeRemaining] = useState(3600); 
  const [userInfo, setUserInfo] = useState<{ username: string; team: string }>({
    username: 'Firstname LASTNAME',
    team: 'Team 1',
  });
  const router = useRouter();
  const pathname = usePathname();

  const stageName =
    pathname === '/stage1'
      ? 'Analytics & Due Diligence'
      : pathname === '/stage2'
      ? 'Structuring'
      : '';

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <div className="bg-blue-800 text-white p-4 flex flex-col md:flex-row items-center md:justify-between gap-4">
      {/* Timer */}
      <div className="flex items-center gap-2">
        <span className="text-base md:text-lg font-bold">{formatTime(timeRemaining)} Remaining</span>
        <FaClock className="text-xl md:text-2xl" />
      </div>

      {/* Stage Name */}
      <div className="text-base md:text-lg font-bold text-center">{stageName}</div>

      {/* Player Info */}
      <div className="flex flex-col items-center md:items-end">
        <div className="text-base md:text-lg font-bold">{userInfo.username}, {userInfo.team}</div>
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
