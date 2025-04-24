import React from 'react';

interface FactorCardProps {
  factorName: string;
  score: number;
  reason: string;
  onScoreChange: (score: number) => void;
  onReasonChange: (reason: string) => void;
  onInfoClick: () => void;
  onApprove?: () => void;
}

const FactorCard: React.FC<FactorCardProps> = ({
  factorName,
  score,
  reason,
  onScoreChange,
  onReasonChange,
  onInfoClick,
  onApprove,
}) => {
  const handleScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newScore = Number(event.target.value);
    onScoreChange(newScore); // Update the score in the store
  };

  const handleReasonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newReason = event.target.value;
    if (newReason.length <= 300) {
      onReasonChange(newReason); // Update the reason in the store
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3
        className="text-lg font-bold cursor-pointer text-blue-500 hover:underline"
        onClick={onInfoClick}
      >
        {factorName}
      </h3>
      <div className="mt-4">
        <label className="block text-gray-700 font-bold mb-2">Score (1 to 10):</label>
        <input
          type="range"
          min="1"
          max="10"
          value={score} // Use the score from props
          onChange={handleScoreChange}
          className="w-full"
        />
        <p className="text-gray-600 mt-1">Selected Score: {score}</p>
      </div>
      <div className="mt-4">
        <label className="block text-gray-700 font-bold mb-2">Reason (max 300 characters):</label>
        <textarea
          value={reason} // Use the reason from props
          onChange={handleReasonChange}
          maxLength={300}
          placeholder="Enter your SWOT points (e.g., bullet points)"
          className="w-full p-2 border rounded"
        />
        <p className="text-gray-500 text-sm mt-1">{reason.length}/300 characters</p>
      </div>
      {onApprove && ( // Conditionally render the Approve button
        <div className="mt-4">
          <button
            onClick={onApprove}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Approve
          </button>
        </div>
      )}
    </div>
  );
};

export default FactorCard;