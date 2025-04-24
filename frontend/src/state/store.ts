import { create } from 'zustand';

interface Factor {
  id: string;
  name: string;
  description: string;
  score: number;
  reasons: string;
  approved: boolean;
}

interface SimulationState {
  factors: Factor[];
  setFactorScore: (id: string, score: number) => void;
  setFactorReason: (id: string, reasons: string) => void;
  approveScore: (id: string) => void;
}

// Load initial factors from localStorage or use default values
const loadInitialFactors = (): Factor[] => {
  if (typeof window !== 'undefined') { // Check if running in the browser
    const savedFactors = localStorage.getItem('factors');
    if (savedFactors) {
      return JSON.parse(savedFactors);
    }
  }
  // Default factors if no data is in localStorage or running on the server
  return [
    {
      id: 'brandRecognition',
      name: 'Brand Recognition and Market Position',
      description: 'How well the brand is recognized in the market.',
      score: 0,
      reasons: '',
      approved: false,
    },
    {
      id: 'techScalability',
      name: 'Technology Scalability and Infrastructure',
      description: 'The ability of the technology to scale with demand.',
      score: 0,
      reasons: '',
      approved: false,
    },
  ];
};

const useStore = create<SimulationState>((set) => ({
  factors: loadInitialFactors(), // Initialize factors from localStorage or default values
  setFactorScore: (id, score) =>
    set((state) => ({
      factors: state.factors.map((factor) =>
        factor.id === id ? { ...factor, score } : factor
      ),
    })),
  setFactorReason: (id, reasons) =>
    set((state) => ({
      factors: state.factors.map((factor) =>
        factor.id === id ? { ...factor, reasons } : factor
      ),
    })),
  approveScore: (id) =>
    set((state) => ({
      factors: state.factors.map((factor) =>
        factor.id === id ? { ...factor, approved: true } : factor
      ),
    })),
}));

export default useStore;