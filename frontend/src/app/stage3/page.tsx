"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface TeamData {
  scores: { [key: string]: number };
  reasons: { [key: string]: string };
  okayed: { [key: string]: boolean };
}

interface FinalizedData {
  team1Data: TeamData;
  team2Data: TeamData;
  approvalStatus: { [key: string]: string };
  finalizedAt: string;
}

const Stage3: React.FC = () => {
  const router = useRouter();
  
  const [finalData, setFinalData] = useState<FinalizedData | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('finalizedData');
    if (savedData) {
      setFinalData(JSON.parse(savedData));
    }
  }, []);

  if (!finalData) return <div className='flex justify-center items-center text-black'>No Final Summary loaded...</div>;

  const handleReset = () => {
    // Reset localStorage
    localStorage.removeItem('finalizedData');
    localStorage.removeItem('factors');

    // Reset the initial factors
    const defaultTeamData = {
      scores: {
        'Brand Recognition and Market Position': 0,
        'Technology Scalability and Infrastructure': 0
      },
      reasons: {
        'Brand Recognition and Market Position': '',
        'Technology Scalability and Infrastructure': ''
      },
      okayed: {
        'Brand Recognition and Market Position': false,
        'Technology Scalability and Infrastructure': false
      }
    };
    // Save reset state to localStorage
    const resetFactors = {
      "team 1": defaultTeamData,
      "team 2": defaultTeamData
    };
    localStorage.setItem("factors", JSON.stringify(resetFactors));

    // Redirect to stage 1
    router.push('/stage1');
  };

  return (
    <div className="container mx-auto p-8 text-black">
      <h1 className="text-3xl font-bold mb-8">Final Agreement Summary</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Agreed Scores</h2>
        {Object.entries(finalData.team1Data.scores).map(([factorId, score]: [string, number]) => (
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

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
        >
          Try Another Round
        </button>
      </div>
    </div>
  );
};

export default Stage3;