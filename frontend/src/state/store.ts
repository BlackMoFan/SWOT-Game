import { create } from 'zustand';

export interface SimulationState {
  factors: Array<{ id: string; score: number; reasons: string }>;
  setFactorScore: (id: string, score: number) => void;
  setFactorReason: (id: string, reason: string) => void;
  setFactors: (factors: Array<{ id: string; score: number; reasons: string }>) => void;
  isNextStageAvailable: boolean;
  setIsNextStageAvailable: (isAvailable: boolean) => void;
  approveScore: (id: string) => void;
  team1Data: { scores: { [key: string]: number }; reasons: { [key: string]: string }; okayed: { [key: string]: boolean } };
  team2Data: { scores: { [key: string]: number }; reasons: { [key: string]: string }; okayed: { [key: string]: boolean } };
  setTeam1Data: (data: { scores: { [key: string]: number }; reasons: { [key: string]: string }; okayed: { [key: string]: boolean } }) => void;
  setTeam2Data: (data: { scores: { [key: string]: number }; reasons: { [key: string]: string }; okayed: { [key: string]: boolean } }) => void;
  currentUser: { username: string; team: string } | null;
  setCurrentUser: (user: { username: string; team: string } | null) => void;
  businessApproved: boolean;
  setBusinessApproved: (approved: boolean) => void;
  riskApproved: boolean;
  setRiskApproved: (approved: boolean) => void;
  isFinalizing: boolean;
  setIsFinalizing: (finalizing: boolean) => void;
  isFinalized: boolean;
  setIsFinalized: (finalized: boolean) => void;
  approvalStatus: { [key: string]: string };
  setApprovalStatus: (factorId: string, status: string) => void;
  toggleOkayed: (factorId: string) => void;
  loadInitialFactors: () => void;
}

export const useStore = create<SimulationState>((set) => ({
  factors: [],
  setFactorScore: (id, score) =>
    set((state) => ({
      factors: state.factors.map((factor) =>
        factor.id === id ? { ...factor, score } : factor
      ),
    })),
  setFactorReason: (id, reason) =>
    set((state) => ({
      factors: state.factors.map((factor) =>
        factor.id === id ? { ...factor, reasons: reason } : factor
      ),
    })),
  setFactors: (factors) => set(() => ({ factors })),
  isNextStageAvailable: false,
  setIsNextStageAvailable: (isAvailable) => set(() => ({ isNextStageAvailable: isAvailable })),
  loadInitialFactors: () => {
    const defaultFactors = [
      { id: "Brand Recognition and Market Position", score: 0, reasons: "" },
      { id: "Technology Scalability and Infrastructure", score: 0, reasons: "" },
    ];

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

    const defaultApprovalStatus = {
      'Brand Recognition and Market Position': 'TBD',
      'Technology Scalability and Infrastructure': 'TBD'
    };

    const savedFactors = localStorage.getItem("factors");
    if (savedFactors) {
      const parsedFactors = JSON.parse(savedFactors);
      const team1 = parsedFactors["team 1"] || defaultTeamData;
      const team2 = parsedFactors["team 2"] || defaultTeamData;

      // Ensure all properties exist
      team1.scores = team1.scores || defaultTeamData.scores;
      team1.reasons = team1.reasons || defaultTeamData.reasons;
      team1.okayed = team1.okayed || defaultTeamData.okayed;

      team2.scores = team2.scores || defaultTeamData.scores;
      team2.reasons = team2.reasons || defaultTeamData.reasons;
      team2.okayed = team2.okayed || defaultTeamData.okayed;

      // Set initial approvalStatus based on team1Data.okayed
      const initialApprovalStatus = Object.keys(team1.okayed).reduce((acc, factorId) => ({
        ...acc,
        [factorId]: team1.okayed[factorId] ? "Okay" : "TBD"
      }), {});

      set(() => ({ 
        factors: defaultFactors,
        team1Data: team1,
        team2Data: team2,
        approvalStatus: initialApprovalStatus
      }));
    } else {
      set(() => ({
        factors: defaultFactors,
        team1Data: defaultTeamData,
        team2Data: defaultTeamData,
        approvalStatus: defaultApprovalStatus
      }));
    }
  },
  approveScore: (id) =>
    set((state) => ({
      factors: state.factors.map((factor) =>
        factor.id === id ? { ...factor, approved: true } : factor
      ),
    })),
  team1Data: { scores: {}, reasons: {}, okayed: {} },
  team2Data: { scores: {}, reasons: {}, okayed: {} },
  setTeam1Data: (data) => set(() => ({ team1Data: data })),
  setTeam2Data: (data) => set(() => ({ team2Data: data })),
  currentUser: null,
  setCurrentUser: (user) => set(() => ({ currentUser: user })),
  businessApproved: false,
  setBusinessApproved: (approved) => set(() => ({ businessApproved: approved })),
  riskApproved: false,
  setRiskApproved: (approved) => set(() => ({ riskApproved: approved })),
  isFinalizing: false,
  setIsFinalizing: (finalizing) => set(() => ({ isFinalizing: finalizing })),
  isFinalized: false,
  setIsFinalized: (finalized) => set(() => ({ isFinalized: finalized })),
  approvalStatus: {},
  setApprovalStatus: (factorId: string, status: string) =>
    set((state) => ({
      approvalStatus: {
        ...state.approvalStatus,
        [factorId]: status,
      },
      team1Data: {
        ...state.team1Data,
        okayed: {
          ...state.team1Data.okayed,
          [factorId]: status === "Okay",
        },
      },
    })),
  toggleOkayed: (factorId) =>
    set((state) => {
      const newOkayedStatus = !state.team1Data.okayed[factorId];
      return {
        team1Data: {
          ...state.team1Data,
          okayed: {
            ...state.team1Data.okayed,
            [factorId]: newOkayedStatus,
          },
        },
        approvalStatus: {
          ...state.approvalStatus,
          [factorId]: newOkayedStatus ? "Okay" : "TBD",
        },
      };
    }),
}));