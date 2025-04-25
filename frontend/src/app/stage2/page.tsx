"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "@/state/store";

const Stage2: React.FC = () => {
  const {
    setFactorScore,
    setFactorReason,
    team1Data,
    team2Data,
    setTeam1Data,
    currentUser,
    setCurrentUser,
    approvalStatus,
    setApprovalStatus,
    toggleOkayed,
    loadInitialFactors,
  } = useStore();

  const [showSummaryNotification, setShowSummaryNotification] = useState(false);
  const [showToastLocalStorageUpdated, setShowToastLocalStorageUpdated] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user)); // Parse and set the current user
    }

    // Use Zustand's loadInitialFactors instead of manual initialization
    loadInitialFactors();
  }, []);

  // Persist changes to team1Data in localStorage
  useEffect(() => {
    if (currentUser?.team === "team 1") {
      const savedFactors = localStorage.getItem("factors") || "{}";
      const parsedFactors = JSON.parse(savedFactors);

      parsedFactors["team 1"] = team1Data; // Update team 1 data in localStorage
      localStorage.setItem("factors", JSON.stringify(parsedFactors));
      setShowToastLocalStorageUpdated(true);
      setTimeout(() => setShowToastLocalStorageUpdated(false), 3000);
    }
  }, [team1Data, currentUser]);

  useEffect(() => {
    // Check if finalizedData exists
    const finalizedData = localStorage.getItem('finalizedData');
    if (finalizedData) {
      setShowSummaryNotification(true);
    }
  }, []);

  const calculateAverageScore = (scores: { [id: string]: number }) => {
    const values = Object.values(scores);
    return values.length > 0
      ? (values.reduce((sum, score) => sum + score, 0) / values.length).toFixed(2)
      : "0.00";
  };

  const handleScoreChange = (team: string, factorId: string, newScore: number) => {
    if (team === "team 1") {
      setTeam1Data({
        ...team1Data,
        scores: { ...team1Data.scores, [factorId]: newScore },
      });
      setFactorScore(factorId, newScore); // Update the store
    }
  };

  const handleReasonChange = (team: string, factorId: string, newReason: string) => {
    if (team === "team 1") {
      setTeam1Data({
        ...team1Data,
        reasons: { ...team1Data.reasons, [factorId]: newReason },
      });
      setFactorReason(factorId, newReason); // Update the store
    }
  };

  // Add this function with the other handlers
  const handleFinalApproval = async () => {
    setIsSubmitting(true);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Save final state to localStorage for summary page
    const finalState = {
      team1Data,
      team2Data,
      approvalStatus,
      finalizedAt: new Date().toISOString()
    };
    localStorage.setItem('finalizedData', JSON.stringify(finalState));
    
    // Redirect to summary page
    window.location.href = '/stage3';
  };

  const handleApprovalClick = (factorId: string) => {
    // Get the new status
    const newStatus = approvalStatus[factorId] === "Okay" ? "TBD" : "Okay";
    
    // Update Zustand state first
    setApprovalStatus(factorId, newStatus);
    
    // Update localStorage
    const savedFactors = localStorage.getItem("factors") || "{}";
    const parsedFactors = JSON.parse(savedFactors);
    
    parsedFactors["team 1"] = {
      ...team1Data,
      okayed: {
        ...team1Data.okayed,
        [factorId]: newStatus === "Okay"
      }
    };
    
    // Update localStorage and show toast
    localStorage.setItem("factors", JSON.stringify(parsedFactors));
    setShowToastLocalStorageUpdated(true);
    setTimeout(() => setShowToastLocalStorageUpdated(false), 3000);
  };

  const areAllFactorsApproved = () => {
    // Check if all factors in approvalStatus are "Okay"
    const factorIds = ['Brand Recognition and Market Position', 'Technology Scalability and Infrastructure'];
    return factorIds.every(factorId => approvalStatus[factorId] === "Okay");
  };

  // Handle navigation to summary
  const goToSummary = () => {
    window.location.href = '/stage3';
  };

  return (
    <div className="flex flex-col text-black">
      {showSummaryNotification && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 flex justify-between items-center">
          <div>
            <p className="font-bold">Summary Available!</p>
            <p>Final agreement data is available in the summary page.</p>
          </div>
          <button
            onClick={goToSummary}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View Summary
          </button>
        </div>
      )}
      <div className="flex flex-row gap-6">
        {/* Left Pane */}
        <div className={`flex-${currentUser?.team === "team 1" ? "1" : "2"} bg-gray-100 p-4 rounded-lg shadow-md`}>
          <h2 className="text-xl font-bold mb-4 text-center">
            {currentUser?.team === "team 1" ? "Business Development Team" : "Risk Management Team"}
          </h2>
          <p className="text-lg font-bold text-center text-blue-500">
            Average Score: {currentUser?.team === "team 1" ? calculateAverageScore(team1Data?.scores || {}) : calculateAverageScore(team2Data?.scores || {})}
          </p>
          {Object.keys((currentUser?.team === "team 1" ? team1Data : team2Data)?.scores || {}).map((factorId) => (
            <div key={factorId} className="mb-6 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-500">{factorId}</h3>
                <p className="text-gray-700 mt-2">
                  Score: {currentUser?.team === "team 1" ? (
                    <>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={team1Data.scores[factorId] || 0}
                        onChange={(e) => handleScoreChange("team 1", factorId, Number(e.target.value))}
                        className={`w-full ${currentUser?.team !== "team 1" ? "cursor-not-allowed" : ""}`}
                        disabled={currentUser?.team !== "team 1"}
                      />
                      <span className="ml-2">{team1Data.scores[factorId] || 0}</span>
                    </>
                  ) : (
                    <>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={team2Data.scores[factorId] || 0}
                        className="w-full cursor-not-allowed"
                        disabled
                      />
                      <span className="ml-2">{team2Data.scores[factorId] || 0}</span>
                    </>
                  )}
                </p>
                <p className="text-gray-700 mt-2">
                  Reason: {currentUser?.team === "team 1" ? (
                    <textarea
                      value={team1Data.reasons[factorId] || ""}
                      onChange={(e) => handleReasonChange("team 1", factorId, e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                      disabled={currentUser?.team !== "team 1"}
                    />
                  ) : (
                    team2Data.reasons[factorId] || ""
                  )}
                </p>
              </div>
              {currentUser?.team === "team 1" && (
              <label
                className={`ml-4 flex items-center cursor-not-allowed`}
                title="This is managed by the Risk Management Team"
              >
                <span className="mr-2 text-gray-700">{team1Data.okayed[factorId] ? "Okay" : "TBD"}</span>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={team1Data.okayed[factorId] || false}
                  onChange={() => currentUser?.team === "team 2" && toggleOkayed(factorId)}
                  disabled
                />
                <div
                  className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 ${
                    team1Data.okayed[factorId] ? "bg-green-500" : "bg-gray-500"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                      team1Data.okayed[factorId] ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </label>
              )}
            </div>
          ))}
        </div>

        {/* Right Pane */}
        <div className={`flex-${currentUser?.team === "team 1" ? "2" : "1"} bg-gray-100 p-4 rounded-lg shadow-md`}>
          <h2 className="text-xl font-bold mb-4 text-center">
            {currentUser?.team === "team 1" ? "Risk Management Team" : "Business Development Team"}
          </h2>
          <p className="text-lg font-bold text-center text-blue-500">
            Average Score: {currentUser?.team === "team 1" ? calculateAverageScore(team2Data?.scores || {}) : calculateAverageScore(team1Data?.scores || {})}
          </p>
          {Object.keys((currentUser?.team === "team 1" ? team2Data : team1Data)?.scores || {}).map((factorId) => (
            <div key={factorId} className="mb-6 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-500">{factorId}</h3>
                <p className="text-gray-700 mt-2">
                  Score: {currentUser?.team === "team 1" ? (
                    <>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={team2Data.scores[factorId] || 0}
                        className="w-full cursor-not-allowed"
                        disabled
                      />
                      <span className="ml-2">{team2Data.scores[factorId] || 0}</span>
                    </>
                  ) : (
                    <>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={team1Data.scores[factorId] || 0}
                        className="w-full cursor-not-allowed"
                        disabled
                      />
                      <span className="ml-2">{team1Data.scores[factorId] || 0}</span>
                    </>
                  )}
                </p>
                <p className="text-gray-700 mt-2">
                  Reason: {currentUser?.team === "team 1" ? (
                    team2Data.reasons[factorId] || ""
                  ) : (
                    team1Data.reasons[factorId] || ""
                  )}
                </p>
              </div>
              {currentUser?.team === "team 2" && (
              <label
                className={`ml-4 flex items-center ${currentUser?.team === "team 2" ? "cursor-pointer" : "cursor-not-allowed"}`}
                title={currentUser?.team === "team 2" ? "Click to toggle" : "This is managed by the Risk Management Team"}
              >
                <span className="mr-2 text-gray-700">{approvalStatus[factorId]}</span>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={approvalStatus[factorId] === "Okay"}
                  onChange={() => currentUser?.team === "team 2" && handleApprovalClick(factorId)}
                  disabled={currentUser?.team !== "team 2"}
                />
                <div
                  className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 ${
                    approvalStatus[factorId] === "Okay" ? "bg-green-500" : "bg-gray-500"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                      approvalStatus[factorId] === "Okay" ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </label>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Approvals Section */}
      {areAllFactorsApproved() && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Approvals</h2>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-700">Business Development Team:</p>
              <button
                className="px-4 py-2 rounded bg-green-500 text-white cursor-not-allowed opacity-75"
                disabled={true}
                title="Business Development Team's approval is automatic"
              >
                Approved
              </button>
            </div>
            <div>
              <p className="text-gray-700">Risk Management Team:</p>
              <button
                onClick={() => currentUser?.team === "team 2" && setShowApprovalModal(true)}
                className={`px-4 py-2 rounded ${
                  currentUser?.team === "team 2" 
                    ? "bg-gray-500 text-white hover:bg-gray-600 cursor-pointer" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={currentUser?.team !== "team 2"}
                title={currentUser?.team !== "team 2" ? "Only Risk Management Team can approve" : "Click to approve"}
              >
                {currentUser?.team === "team 2" ? "Approve" : "Pending Approval"}
              </button>
            </div>
          </div>
        </div>
      )}

      { /*Modal for Final Approval */ }
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-5 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Approval</h3>
            <p className="text-gray-700 mb-6">Are you sure you want to approve this? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleFinalApproval}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Finalizing...
                  </span>
                ) : (
                  'Finalize'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showToastLocalStorageUpdated && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          Changes saved to localStorage!
        </div>
      )}
    </div>
  );
};

export default Stage2;