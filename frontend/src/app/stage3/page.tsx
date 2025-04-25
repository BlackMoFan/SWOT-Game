"use client";

import React, { useEffect, useState } from 'react';
import { useStore } from '@/state/store';

const Stage3: React.FC = () => {
  const [finalData, setFinalData] = useState<any>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('finalizedData');
    if (savedData) {
      setFinalData(JSON.parse(savedData));
    }
  }, []);

  if (!finalData) return <div className='flex justify-center items-center text-black'>No Final Summary loaded...</div>;

  return (
    <div className="container mx-auto p-8 text-black">
      <h1 className="text-3xl font-bold mb-8">Final Agreement Summary</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Agreed Scores</h2>
        {Object.entries(finalData.team1Data.scores).map(([factorId, score]: [string, any]) => (
          <div key={factorId} className="mb-6">
            <h3 className="text-xl font-bold text-blue-500">{factorId}</h3>
            <p className="text-gray-700">Final Score: {score}</p>
            <p className="text-gray-700">Reason: {finalData.team1Data.reasons[factorId]}</p>
            <div className="mt-2">
              <span className="inline-block px-3 py-1 bg-green-500 text-white rounded-full text-sm">
                Approved by Both Teams
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-gray-600 text-sm">
        Agreement Finalized on: {new Date(finalData.finalizedAt).toLocaleString()}
      </div>
    </div>
  );
};

export default Stage3;