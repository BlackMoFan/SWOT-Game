"use client";

import React, { useState, useEffect } from "react";
import useStore from "@/state/store";
import { FaTimes } from "react-icons/fa";

const Stage2: React.FC = () => {
  const { setFactorScore, setFactorReason, approveScore } = useStore();
  const [approvalStatus, setApprovalStatus] = useState<{ [id: string]: string }>({});
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFactor, setCurrentFactor] = useState<any>(null);
  const [businessApproved, setBusinessApproved] = useState(false);
  const [riskApproved, setRiskApproved] = useState(false);
  const [team1Data, setTeam1Data] = useState<any>({ scores: {}, reasons: {} });
  const [team2Data, setTeam2Data] = useState<any>({ scores: {}, reasons: {} });
  const [currentUser, setCurrentUser] = useState<{ username: string; team: string } | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false); // State for loading effect
  const [isFinalized, setIsFinalized] = useState(false); // State for finalized effect

  // Load user and factors for both teams from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user)); // Parse and set the current user
    }

    const savedFactors = localStorage.getItem("factors");
    if (savedFactors) {
      const parsedFactors = JSON.parse(savedFactors);

      // Check if Team 1 and Team 2 exist in localStorage
      const team1 = parsedFactors["team 1"] || { scores: {}, reasons: {} };
      const team2 = parsedFactors["team 2"] || { scores: {}, reasons: {} };

      setTeam1Data(team1);
      setTeam2Data(team2);

      // Initialize approval status for both teams
      const allFactors = { ...team1.scores, ...team2.scores };
      setApprovalStatus(
        Object.keys(allFactors).reduce((acc: any, id: string) => ({ ...acc, [id]: "TBD" }), {})
      );
    }
    setIsMounted(true);
  }, []);

  const calculateAverageScore = (scores: { [id: string]: number }) => {
    const values = Object.values(scores);
    return values.length > 0
      ? (values.reduce((sum, score) => sum + score, 0) / values.length).toFixed(2)
      : "0.00";
  };

  const handleScoreChange = (team: string, factorId: string, newScore: number) => {
    if (team === "team 1") {
      setTeam1Data((prev: any) => ({
        ...prev,
        scores: { ...prev.scores, [factorId]: newScore },
      }));
      setFactorScore(factorId, newScore); // Update the store
    }
  };

  const handleReasonChange = (team: string, factorId: string, newReason: string) => {
    if (team === "team 1") {
      setTeam1Data((prev: any) => ({
        ...prev,
        reasons: { ...prev.reasons, [factorId]: newReason },
      }));
      setFactorReason(factorId, newReason); // Update the store
    }
  };

  const isTeam1 = currentUser?.team === "team 1";

  const handleFinalizeNegotiation = () => {
    setIsFinalizing(true); // Start loading effect
    setTimeout(() => {
      setIsFinalizing(false); // Stop loading effect
      setIsFinalized(true); // Show finalized effect
    }, 1500); // 1.5 seconds delay
  };

  return (
    <div className="flex flex-col text-black">
      <div className="flex flex-row gap-6">
        {/* Left Pane */}
        <div className={`flex-${isTeam1 ? "1" : "2"} bg-gray-100 p-4 rounded-lg shadow-md`}>
          <h2 className="text-xl font-bold mb-4 text-center">
            {isTeam1 ? "Business Development Team" : "Risk Management Team"}
          </h2>
          <p className="text-lg font-bold text-center text-blue-500">
            Average Score: {isTeam1 ? calculateAverageScore(team1Data?.scores || {}) : calculateAverageScore(team2Data?.scores || {})}
          </p>
          {Object.keys((isTeam1 ? team1Data : team2Data)?.scores || {}).map((factorId) => (
            <div key={factorId} className="mb-6">
              <h3 className="text-lg font-bold text-blue-500">{factorId}</h3>
              <p className="text-gray-700 mt-2">
                Score: {isTeam1 ? (
                  <>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={team1Data.scores[factorId]}
                      onChange={(e) => handleScoreChange("team 1", factorId, Number(e.target.value))}
                      className="w-full"
                    />
                    <span className="ml-2">{team1Data.scores[factorId]}</span>
                  </>
                ) : (
                  team2Data.scores[factorId]
                )}
              </p>
              <p className="text-gray-700 mt-2">
                Reason: {isTeam1 ? (
                  <textarea
                    value={team1Data.reasons[factorId]}
                    onChange={(e) => handleReasonChange("team 1", factorId, e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  team2Data.reasons[factorId]
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Right Pane */}
        <div className={`flex-${isTeam1 ? "2" : "1"} bg-gray-100 p-4 rounded-lg shadow-md`}>
          <h2 className="text-xl font-bold mb-4 text-center">
            {isTeam1 ? "Risk Management Team" : "Business Development Team"}
          </h2>
          <p className="text-lg font-bold text-center text-blue-500">
            Average Score: {isTeam1 ? calculateAverageScore(team2Data?.scores || {}) : calculateAverageScore(team1Data?.scores || {})}
          </p>
          {Object.keys((isTeam1 ? team2Data : team1Data)?.scores || {}).map((factorId) => (
            <div key={factorId} className="mb-6">
              <h3 className="text-lg font-bold text-blue-500">{factorId}</h3>
              <p className="text-gray-700 mt-2">Score: {(isTeam1 ? team2Data : team1Data)?.scores[factorId]}</p>
              <p className="text-gray-700 mt-2">Reason: {(isTeam1 ? team2Data : team1Data)?.reasons[factorId]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Approvals Section */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Approvals</h2>
        <div className="flex justify-between">
          <div>
            <p className="text-gray-700">Business Development Team:</p>
            <button
              onClick={() => setBusinessApproved(true)}
              className={`px-4 py-2 rounded ${businessApproved ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}
              disabled={businessApproved}
            >
              {businessApproved ? "Approved" : "Approve"}
            </button>
          </div>
          <div>
            <p className="text-gray-700">Risk Management Team:</p>
            <button
              onClick={() => setRiskApproved(true)}
              className={`px-4 py-2 rounded ${riskApproved ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}
              disabled={riskApproved}
            >
              {riskApproved ? "Approved" : "Approve"}
            </button>
          </div>
        </div>
        {businessApproved && riskApproved && (
          <div className="mt-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className={`${isFinalized ? "bg-gray-500" : "bg-blue-500"} text-white px-4 py-2 rounded`}
              disabled={isFinalized}
            >
              {isFinalized ? 'Finalized' : 'Finalize Negotiation'}
            </button>
          </div>
        )}
      </div>

      {/* Finalization Modal */}
      {isModalOpen && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black/70">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
            <button
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              onClick={() => setIsModalOpen(false)}
            >
              <FaTimes className="text-2xl" />
            </button>
            {!isFinalized ? (
              <>
                <h2 className="text-xl font-bold mb-4">Finalize Negotiation</h2>
                <p className="text-gray-700 mb-4">Are you sure you want to finalize the negotiation?</p>
                <button
                  onClick={handleFinalizeNegotiation}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  disabled={isFinalizing || isFinalized}
                >
                  {isFinalizing ? "Finalizing..." : "Finalize"}
                </button>
              </>
            ) : (
              <div className="text-center">
                <h2 className="text-xl font-bold text-green-500 mb-4">Negotiation Finalized!</h2>
                <p className="text-gray-700">The negotiation has been successfully completed.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stage2;