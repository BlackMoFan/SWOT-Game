"use client"; // Ensure this is a Client Component

import React, { useState, useEffect } from 'react';
import { FaVideo, FaBullseye, FaFolderOpen, FaTimes } from 'react-icons/fa'; // Import icons from react-icons

const Sidebar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [currentUser, setCurrentUser] = useState<{ username: string; team: string } | null>(null);

  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  useEffect(() => {
    // Get user data only once on mount
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []); // Empty dependency array

  // Showing the mission modal
  useEffect(() => {
    if (!currentUser) return; // Don't proceed if currentUser is not set

    const shouldShowModal = localStorage.getItem('showMissionModal') === 'true';
    if (shouldShowModal) {
      const missionContent = (
        <div className="text-black">
          <h2 className="text-xl font-bold mb-2">Mission</h2>
          <p className="text-black">
            {currentUser.team === "team 1" ? (
              <><span className="font-semibold">For Business Development team:</span> Your mission is to analyze the Strengths and Opportunities.</>
            ) : (
              <><span className="font-semibold">For Risk Management Team:</span> Your mission is to analyze the Weaknesses and Threats.</>
            )}
          </p>
          <button
            onClick={() => {
              closeModal();
              localStorage.removeItem('showMissionModal');
            }}
            className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Got it!
          </button>
        </div>
      );
      openModal(missionContent);
    }
  }, [currentUser]);

  return (
    <div className="w-fit bg-blue-900 p-4 h-screen flex flex-col justify-between">
      {/* Menu Items */}
      <div>
        <ul className="space-y-4">
          <li>
            <button
              className="flex items-center hover:underline"
              onClick={() =>
                openModal(
                  <div className="text-black">
                    <h2 className="text-xl font-bold mb-2">Overview Video</h2>
                    <video controls className="w-full">
                      <source src="/placeholder-video.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )
              }
            >
              <FaVideo className="mr-2 text-2xl text-orange-400" />
            </button>
          </li>
          <li>
            <button
              className="flex items-center hover:underline"
              onClick={() =>
                openModal(
                  <div className="text-black">
                    <h2 className="text-xl font-bold mb-2">Mission</h2>
                    <p className="text-black">
                      <span className="font-semibold">For Business Development team:</span>  Your mission is to analyse the Strengths and Opportunities.<br/>
                      <span className="font-semibold">For Risk Management Team:</span>  Your mission is to analyse the Weaknesses and Threats.
                    </p>
                  </div>
                )
              }
            >
              <FaBullseye className="mr-2 text-2xl text-orange-400" />
            </button>
          </li>
        </ul>

        {/* Horizontal Line */}
        <hr className="my-4 border-gray-400" />

        <ul className="space-y-4">
          <li>
            <button
              className="flex items-center hover:underline"
              onClick={() =>
                openModal(
                  <div className="text-black">
                    <h2 className="text-xl font-bold mb-2">Data Room</h2>
                    <p>
                      The Risk Management team can upload documents here for the Business
                      Development team to view. <strong>The content is read-only for the Business
                      Development team</strong>.
                    </p>
                    <ul className="mt-4 space-y-2">
                      <li>
                        <a
                          href="/documents/sample-document.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Sample Document 1 (PDF)
                        </a>
                      </li>
                      <li>
                        <a
                          href="/documents/sample-image.jpg"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Sample Image (JPG)
                        </a>
                      </li>
                    </ul>
                  </div>
                )
              }
            >
              <FaFolderOpen className="mr-2 text-2xl text-orange-400" />
            </button>
          </li>
        </ul>
      </div>

      {/* Logo */}
      <div className="mt-4">
        <span className="text-4xl font-bold text-orange-400">F</span>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-5 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
            <button
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              onClick={closeModal}
            >
              <FaTimes className="text-2xl" />
            </button>
            {modalContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;