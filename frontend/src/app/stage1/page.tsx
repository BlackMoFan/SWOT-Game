"use client";

import React, { useState, useEffect } from 'react';
import { useStore } from '@/state/store';
import FactorCard from '@/components/FactorCard';
import { FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; // Import router for navigation

interface Factor {
  id: string;
  score: number;
  reasons: string;
  okayed?: boolean;
}

const Stage1: React.FC = () => {
  const { factors, setFactorScore, setFactorReason, setFactors, isNextStageAvailable, setIsNextStageAvailable } = useStore();

  const [isMounted, setIsMounted] = useState(false); // Track if the component has mounted
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFactor, setCurrentFactor] = useState<Factor | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [currentUser, setCurrentUser] = useState<{ username: string; team: string } | null>(null);

  const router = useRouter(); // Initialize router for navigation

  // Default factors to display if no data exists in localStorage
  const defaultFactors = [
    { id: 'Brand Recognition and Market Position', score: 0, reasons: '' },
    { id: 'Technology Scalability and Infrastructure', score: 0, reasons: '' },
  ];

  // First useEffect to set the current user
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setIsMounted(true);
  }, []); // Empty dependency array as this should only run once

  // Second useEffect to handle factors initialization
  useEffect(() => {
    if (!isMounted) return; // Don't run if not mounted yet

    const savedFactors = localStorage.getItem("factors");
    if (savedFactors) {
      const parsedFactors = JSON.parse(savedFactors);
      const user = localStorage.getItem("user");
      const currentTeam = user ? JSON.parse(user).team : null;
      
      if (currentTeam) {
        const teamData = parsedFactors[currentTeam] || { scores: {}, reasons: {}, okayed: {} };

        // Ensure all properties are initialized
        teamData.scores = teamData.scores || {};
        teamData.reasons = teamData.reasons || {};
        teamData.okayed = teamData.okayed || {};

        const factorsArray = defaultFactors.map(defaultFactor => ({
          id: defaultFactor.id,
          score: teamData.scores[defaultFactor.id] || 0,
          reasons: teamData.reasons[defaultFactor.id] || "",
          okayed: teamData.okayed[defaultFactor.id] || false,
        }));

        setFactors(factorsArray);
      }
    } else {
      // Initialize with default factors if no saved data
      setFactors(defaultFactors.map(factor => ({ ...factor, okayed: false })));
    }
  }, [isMounted]); // Only depend on isMounted

  // Load factors for the current team from localStorage or use default factors
  useEffect(() => {
    if (!currentUser) return;

    const savedFactors = localStorage.getItem('factors');
    if (savedFactors) {
      const parsedFactors = JSON.parse(savedFactors);
      const teamData = parsedFactors[currentUser.team] || { scores: {}, reasons: {} };

      // Transform the scores and reasons into an array of factors
      const factorsArray = Object.keys(teamData.scores).map((id) => ({
        id,
        score: teamData.scores[id],
        reasons: teamData.reasons[id] || '',
      }));

      setFactors(factorsArray.length > 0 ? factorsArray : defaultFactors); // Use default factors if no data exists
    } else {
      setFactors(defaultFactors); // Use default factors if no data exists in localStorage
    }
  }, [currentUser]);

  // Check if both teams are populated in localStorage
  useEffect(() => {
    const savedFactors = localStorage.getItem('factors');
    if (savedFactors) {
      const parsedFactors = JSON.parse(savedFactors);
      const team1 = parsedFactors['team 1'] || { scores: {}, reasons: {} };
      const team2 = parsedFactors['team 2'] || { scores: {}, reasons: {} };

      const isTeam1Populated = Object.keys(team1.scores).length > 0 || Object.keys(team1.reasons).length > 0;
      const isTeam2Populated = Object.keys(team2.scores).length > 0 || Object.keys(team2.reasons).length > 0;

      setIsNextStageAvailable(isTeam1Populated && isTeam2Populated);
    }
  }, [factors]);

  // Auto-save changes to localStorage after 4 seconds of inactivity
  useEffect(() => {
    if (!isMounted || !currentUser) return; // Ensure this runs only after the component has mounted and user is loaded

    const timer = setTimeout(() => {
      if (Date.now() - lastInteraction >= 4000) {
        const existingData = JSON.parse(localStorage.getItem('factors') || '{}');
        const teamData = existingData[currentUser.team] || { scores: {}, reasons: {} };

        // Update team-specific data
        teamData.scores = factors.reduce((acc: any, factor: any) => {
          acc[factor.id] = factor.score;
          return acc;
        }, {});

        teamData.reasons = factors.reduce<{ [key: string]: string }>((acc, factor) => {
          acc[factor.id] = factor.reasons;
          return acc;
        }, {});

        // Save updated data back to localStorage
        existingData[currentUser.team] = teamData;
        localStorage.setItem('factors', JSON.stringify(existingData));

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

        // Update the "Go to the Next Stage" button state
        const savedFactors = localStorage.getItem('factors');
        if (savedFactors) {
          const parsedFactors = JSON.parse(savedFactors);
          const team1 = parsedFactors['team 1'] || { scores: {}, reasons: {} };
          const team2 = parsedFactors['team 2'] || { scores: {}, reasons: {} };

          const isTeam1Populated = Object.keys(team1.scores).length > 0 || Object.keys(team1.reasons).length > 0;
          const isTeam2Populated = Object.keys(team2.scores).length > 0 || Object.keys(team2.reasons).length > 0;

          setIsNextStageAvailable(isTeam1Populated && isTeam2Populated);
        }
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [factors, lastInteraction, isMounted, currentUser]);

  const handleSliderChange = (id: string, score: number) => {
    setFactorScore(id, score); // Update global state using Zustand
    setLastInteraction(Date.now());
  };

  const handleReasonChange = (id: string, reason: string) => {
    if (reason.length <= 300) {
      setFactorReason(id, reason); // Update global state using Zustand
      setLastInteraction(Date.now());
    }
  };

  const openModal = (factor: any) => {
    setCurrentFactor(factor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentFactor(null);
  };

  const goToNextStage = () => {
    router.push('/stage2'); // Navigate to Stage 2
  };

  if (!isMounted) {
    // Avoid rendering until the component has mounted
    return null;
  }

  return (
    <div className="flex text-black flex-col">
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">SWOT Simulation – Stage 1</h1>
        <div className="space-y-6">
          {factors.map((factor) => (
            <FactorCard
              key={factor.id}
              factorName={factor.id} // Use the factor ID as the name
              score={factor.score} // Pass score from the state
              reason={factor.reasons} // Pass reason from the state
              onScoreChange={(score) => handleSliderChange(factor.id, score)}
              onReasonChange={(reason) => handleReasonChange(factor.id, reason)}
              onInfoClick={() => openModal(factor)}
            />
          ))}
        </div>
        {isModalOpen && currentFactor && (
          <div className="modal fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-5">
            <div className="bg-white p-6 rounded shadow-lg w-96 relative">
              <button
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                onClick={closeModal}
              >
                <FaTimes className="text-2xl" />
              </button>
              <h2 className="text-xl font-bold mb-2">{currentFactor.id}</h2>
              <p>{currentFactor.reasons}</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <button
          onClick={goToNextStage}
          disabled={!isNextStageAvailable}
          className={`w-full px-4 py-2 rounded text-white ${
            isNextStageAvailable ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Go to the Next Stage
        </button>
      </div>
    {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
        Changes saved to localStorage!
        </div>
    )}
    </div>
  );
};

export default Stage1;